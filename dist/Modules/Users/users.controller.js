"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
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
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, id, phoneNumber, role, page = 1, limit = 10 } = req.query;
        const filters = {};
        if (email)
            filters.email = { contains: String(email), mode: 'insensitive' };
        if (id)
            filters.id = Number(id);
        if (phoneNumber)
            filters.phoneNumber = { contains: String(phoneNumber) };
        if (role)
            filters.role = String(role).toUpperCase();
        const skip = (Number(page) - 1) * Number(limit);
        const [users, total] = yield Promise.all([
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
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
});
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
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    yield prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted successfully' });
});
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
const addAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, phoneNumber, firstName, lastName } = req.body;
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma.user.create({
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
    }
    catch (error) {
        return res.status(500).json({ message: "Registration failed", error });
    }
});
exports.default = {
    getAllUsers,
    deleteUser,
    addAdmin
};
