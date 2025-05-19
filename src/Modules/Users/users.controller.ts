import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users with optional filters and pagination
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by email (partial match, case-insensitive)
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *       - in: query
 *         name: phoneNumber
 *         schema:
 *           type: string
 *         description: Filter by phone number
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [USER, ADMIN, SUPERUSER]
 *         description: Filter by role
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 50
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 pageSize:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Failed to fetch users
 */

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, id, phoneNumber, role, page = 1, limit = 10 } = req.query;

        const filters: any = {};

        if (email) filters.email = { contains: String(email), mode: 'insensitive' };
        if (id) filters.id = Number(id);
        if (phoneNumber) filters.phoneNumber = { contains: String(phoneNumber) };
        if (role) filters.role = String(role).toUpperCase();

        const skip = (Number(page) - 1) * Number(limit);

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where: filters,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({
                where: filters,
            }),
        ]);


        res.status(200).json({
            total,
            page: Number(page),
            pageSize: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
            data: users,
        });
    } catch (error: any) {
        console.error('Error fetching users:', error);

        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};
export default {
    getAllUsers
}