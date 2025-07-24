import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../../Config/mailService';

const prisma = new PrismaClient();
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create an order from user's cart items
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [address, phone]
 *             properties:
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               governmentId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Cart is empty or invalid input
 *       500:
 *         description: Server error during order creation
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (with optional filters)
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, DELIVERED, CANCELED]
 *         description: Filter by order status
 *       - in: query
 *         name: governmentId
 *         schema:
 *           type: integer
 *         description: Filter by government ID
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter orders created after this date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter orders created before this date
 *     responses:
 *       200:
 *         description: A list of orders with their items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Failed to fetch orders
 */


/**
 * @swagger
 * /api/orders/me:
 *   get:
 *     summary: Get orders for the authenticated user
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders with nested items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   total:
 *                     type: number
 *                   status:
 *                     type: string
 *                     enum: [PENDING, DELIVERED, CANCELED]
 *                   address:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         productId:
 *                           type: integer
 *                         colorId:
 *                           type: integer
 *                         sizeId:
 *                           type: integer
 *                         quantity:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update the status of an order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, DELIVERED, CANCELED]
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Failed to update order
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Order deleted successfully
 *       403:
 *         description: Forbidden – Not allowed
 *       404:
 *         description: Order not found
 *       400:
 *         description: Bad request or server error
 */

export const createOrder = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { address, phone, governmentId } = req.body;

  if (!address || !phone || !governmentId) {
    return res.status(400).json({ error: "Address, phone, and government ID are required" });
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true, color: true, size: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          address,
          phone,
          governmentId,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              colorId: item.colorId,
              sizeId: item.sizeId,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
              color: true,
              size: true,
            },
          },
        },
      });

      await Promise.all(
        cartItems.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        )
      );

      await tx.cartItem.deleteMany({ where: { userId } });

      return newOrder;
    });

    // Email logic (unchanged)
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #b88c2c;">🛍️ New Order Notification</h2>
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Total:</strong> <span style="color: #b88c2c;">EGP ${total.toFixed(2)}</span></p>
        <h3 style="margin-top: 20px;">🧾 Order Items:</h3>
        <ul>
          ${cartItems.map(
            (item) => `
              <li>
                <strong>${item.product.name}</strong> —
                Qty: ${item.quantity},
                Color: ${item.color?.name},
                Size: ${item.size?.label ?? "N/A"}
              </li>`
          ).join("")}
        </ul>
        <p>View it now <a href="https://dashboard.ryo-egypt.com/orders">here</a></p>
      </div>
    `;

    await sendEmail("elfarm879@gmail.com", "New Order Created 🧾", emailHtml);

    // 🆕 Fetch message from database
    const message = await prisma.message.findFirst(); // or use findUnique({ where: { id: 1 } }) if needed

    res.status(201).json({
      order,
      message: message?.content || "Order placed successfully!",
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
};


export const updateOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error || 'Something went wrong' });
  }
};


export const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (user.role !== "ADMIN" && order.userId !== user.id) {
      return res
        .status(403)
        .json({ error: "You are not allowed to delete this order" });
    }

    await prisma.order.delete({
      where: { id: Number(id) },
    });

    return res.status(201).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};


export const getOrders = async (req: Request, res: Response) => {
  const { userId, status, governmentId, dateFrom, dateTo } = req.query;

  try {
    const orders = await prisma.order.findMany({
      where: {
        ...(userId && { userId: Number(userId) }),
        ...(status && { status: status as any }),
        ...(governmentId && { governmentId: Number(governmentId) }),
        ...(dateFrom || dateTo
          ? {
              createdAt: {
                ...(dateFrom && { gte: new Date(dateFrom as string) }),
                ...(dateTo && { lte: new Date(dateTo as string) }),
              },
            }
          : {}),
      },
      include: {
        user: true,
        items: {
          include: {
            product: { include: { images: true } },
            color: true,
            size: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};


// Updated getUsersOrder
export const getUsersOrder = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: { include: { images: true } },
            color: true,
            size: true,
          },
        },
      },
    });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user's orders" });
  }
};
