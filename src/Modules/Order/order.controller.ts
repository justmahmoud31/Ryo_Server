import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity, total, address, phone]
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input or creation failed
 */

export const createOrder = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { productId, quantity,  address, phone } = req.body;

  if (!productId || !quantity  || !address || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    const total = product.price * quantity;
    // Use a transaction to ensure both operations succeed/fail together
    const [order, updatedProduct] = await prisma.$transaction([
      prisma.order.create({
        data: {
          userId,
          productId,
          quantity,
          total,
          address,
          phone,
        },
      }),
      prisma.product.update({
        where: { id: productId },
        data: {
          stock: {
            decrement: quantity,
          },
        },
      }),
    ]);

    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(400).json({ error: 'Failed to create order' });
  }
};


/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders with filters
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of orders
 */

export const getOrders = async (req: Request, res: Response) => {
  const { productId, userId } = req.query;

  try {
    const orders = await prisma.order.findMany({
      where: {
        ...(productId && { productId: Number(productId) }),
        ...(userId && { userId: Number(userId) }),
      },
      include: {
        user: true,
        product: {
          include: {
            images: true, // optional: include images if you want
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong while fetching orders." });
  }
};

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order status
 *     tags:
 *       - Orders 
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
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, DELIVERED, CANCELED]
 *     responses:
 *       200:
 *         description: Order updated
 */

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

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Order deleted
 */
export const deleteOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.order.delete({ where: { id: Number(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error });
    }
};
/**
 * @swagger
 * /api/orders/me:
 *   get:
 *     summary: Get orders for the currently authenticated user
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   productId:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   status:
 *                     type: string
 *                     enum: [PENDING, DELIVERED, CANCELED]
 *                   product:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                         format: float
 *                       cover_Image:
 *                         type: string
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Internal server error
 */

export const getUsersOrder = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    try {
        const orders = await prisma.order.findMany({
            where: { userId: Number(userId) },
            include: {
                product: true,
            },
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}