import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
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
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: user deleted successfully
 */
const deleteUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted successfully' });
};

/**
 * @swagger
 * /api/users/admin:
 *   post:
 *     summary: Add a new admin user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - phoneNumber
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               phoneNumber:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *       400:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Registration failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
const addAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password, phoneNumber, firstName, lastName } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: "ADMIN",
                phoneNumber,
            },
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: { id: user.id, email: user.email },
        });
    } catch (error) {
        return res.status(500).json({ message: "Registration failed", error });
    }
}
/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user data
 *     description: Returns the authenticated user's profile information.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 firstName:
 *                   type: string
 *                   example: "John"
 *                 lastName:
 *                   type: string
 *                   example: "Doe"
 *                 phoneNumber:
 *                   type: string
 *                   example: "+1234567890"
 *                 role:
 *                   type: string
 *                   example: "user"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T12:00:00Z"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Failed to fetch user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch user data"
 *                 error:
 *                   type: object
 */
const getMyData = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Failed to fetch user data', error: error });
    }
}
export default {
    getAllUsers,
    deleteUser,
    addAdmin,
    getMyData
}