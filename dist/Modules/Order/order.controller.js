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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrder = exports.getOrders = exports.createOrder = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
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
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { productId } = req.body;
    try {
        const order = yield prisma.order.create({
            data: { userId, productId },
        });
        res.status(201).json(order);
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
});
exports.createOrder = createOrder;
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders with filters
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
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { productId } = req.query;
    try {
        const orders = yield prisma.order.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.getOrders = getOrders;
/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order
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
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { productId } = req.body;
    try {
        const updated = yield prisma.order.update({
            where: { id: Number(id) },
            data: { userId, productId },
        });
        res.status(200).json(updated);
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
});
exports.updateOrder = updateOrder;
/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order
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
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.order.delete({ where: { id: Number(id) } });
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
});
exports.deleteOrder = deleteOrder;
