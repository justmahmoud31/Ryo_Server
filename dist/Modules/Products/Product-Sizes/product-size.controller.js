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
exports.deleteSize = exports.updateSize = exports.getSizes = exports.createSize = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * @swagger
 * /api/sizes:
 *   post:
 *     summary: Create a new size
 *     description: Creates a new size entry with a label.
 *     tags:
 *       - Sizes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *             properties:
 *               label:
 *                 type: string
 *     responses:
 *       201:
 *         description: Size created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Size'
 *       500:
 *         description: Server error.
 */
const createSize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { label } = req.body;
        const size = yield prisma.size.create({ data: { label } });
        res.status(201).json(size);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createSize = createSize;
/**
 * @swagger
 * /api/sizes:
 *   get:
 *     summary: Get a list of sizes
 *     description: Retrieve all sizes, with optional filtering by id or label.
 *     tags:
 *       - Sizes
 *     security: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: Filter sizes by ID.
 *       - in: query
 *         name: label
 *         schema:
 *           type: string
 *         description: Filter sizes by label (partial, case-insensitive).
 *     responses:
 *       200:
 *         description: A list of sizes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Size'
 *       500:
 *         description: Server error.
 */
const getSizes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, label } = req.query;
        const filters = {};
        if (id)
            filters.id = parseInt(id);
        if (label)
            filters.label = { contains: label, mode: 'insensitive' };
        const sizes = yield prisma.size.findMany({ where: filters });
        res.json(sizes);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getSizes = getSizes;
/**
 * @swagger
 * /api/sizes/{id}:
 *   put:
 *     summary: Update a size
 *     description: Update a size's label by its ID.
 *     tags:
 *       - Sizes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The size ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *             properties:
 *               label:
 *                 type: string
 *     responses:
 *       200:
 *         description: Size updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Size'
 *       500:
 *         description: Server error.
 */
const updateSize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { label } = req.body;
        const size = yield prisma.size.update({ where: { id }, data: { label } });
        res.json(size);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateSize = updateSize;
/**
 * @swagger
 * /api/sizes/{id}:
 *   delete:
 *     summary: Delete a size
 *     description: Delete a size by its ID.
 *     tags:
 *       - Sizes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The size ID.
 *     responses:
 *       200:
 *         description: Size deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error.
 */
const deleteSize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        yield prisma.size.delete({ where: { id } });
        res.json({ message: 'Size deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteSize = deleteSize;
