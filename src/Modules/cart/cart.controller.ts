import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart or increase quantity if it already exists
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *               - colorId
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               colorId:
 *                 type: integer
 *               sizeId:
 *                 type: integer
 *               offerId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item added or quantity updated
 *       400:
 *         description: Missing required fields or failed to add
 *       404:
 *         description: Product not found
 */
export const addToCart = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { productId, quantity, colorId, sizeId,offerId } = req.body;

  if (!productId || !quantity || !colorId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: "Product not found" });

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
        colorId,
        sizeId,
        offerId,
      },
    });

    let cartItem;
    if (existingCartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: { increment: quantity },
        },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
          colorId,
          sizeId,
          offerId
        },
      });
    }

    res.status(201).json(cartItem);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Failed to add to cart" });
  }
};

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get all items in the authenticated user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cart:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Failed to fetch cart items
 */
export const getCart = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  try {
    const cart = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { images: true },
        },
        color: true,
        size: true,
        offer: true, // Include offer details if applicable
      },
    });
    res.status(200).json({
      message: "Cart items fetched successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
};
/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear all items from the authenticated user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart cleared successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to clear cart
 */
export const clearCart = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  try {
    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};