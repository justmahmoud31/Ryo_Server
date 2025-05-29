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
 *             required: [userId, productId]
 *             properties:
 *               productId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Order created
 */

export const createOrder = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const { productId } = req.body;
    try {
        const order = await prisma.order.create({
            data: { userId, productId },
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error });
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
    const userId = (req as any).user?.id;
    const { productId } = req.query;
    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: userId ? Number(userId) : undefined,
                productId: productId ? Number(productId) : undefined,
            },
            include: {
                user: true,
                product: true,
            },
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};
/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order
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
 *               productId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order updated
 */

export const updateOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const { productId } = req.body;
    try {
        const updated = await prisma.order.update({
            where: { id: Number(id) },
            data: { userId, productId },
        });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error });
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