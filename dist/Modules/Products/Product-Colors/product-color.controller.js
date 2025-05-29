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
exports.deleteColor = exports.updateColor = exports.getColors = exports.createColor = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * @swagger
 * components:
 *   schemas:
 *     Color:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         hex:
 *           type: string
 *       required:
 *         - name
 *         - hex
 */
/**
 * @swagger
 * /api/colors:
 *   post:
 *     summary: Create a new color
 *     tags:
 *       - Colors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - hex
 *             properties:
 *               name:
 *                 type: string
 *               hex:
 *                 type: string
 *     responses:
 *       201:
 *         description: Color created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Color'
 *       500:
 *         description: Server error
 */
const createColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, hex } = req.body;
        const color = yield prisma.color.create({ data: { name, hex } });
        res.status(201).json(color);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createColor = createColor;
/**
 * @swagger
 * /api/colors:
 *   get:
 *     summary: Retrieve a list of product colors
 *     description: Returns a list of product colors, optionally filtered by ID or name.
 *     tags:
 *       - Colors
 *     security: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: Filter colors by their unique ID.
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter colors by name (case-insensitive, partial match).
 *     responses:
 *       200:
 *         description: A list of product colors.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Color'
 *       500:
 *         description: Server error.
 */
const getColors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name } = req.query;
        const filters = {};
        if (id)
            filters.id = parseInt(id);
        if (name)
            filters.name = { contains: name, mode: 'insensitive' };
        const colors = yield prisma.color.findMany({ where: filters });
        res.json({
            message: "Colors retrived Successfully",
            data: colors
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getColors = getColors;
/**
 * @swagger
 * /api/colors/{id}:
 *   put:
 *     summary: Update a color by ID
 *     tags:
 *       - Colors
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
 *               name:
 *                 type: string
 *               hex:
 *                 type: string
 *     responses:
 *       200:
 *         description: Color updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Color'
 *       500:
 *         description: Server error
 */
const updateColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { name, hex } = req.body;
        const color = yield prisma.color.update({
            where: { id },
            data: { name, hex },
        });
        res.json(color);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateColor = updateColor;
/**
 * @swagger
 * /api/colors/{id}:
 *   delete:
 *     summary: Delete a color by ID
 *     tags:
 *       - Colors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Color deleted successfully
 *       500:
 *         description: Server error
 */
const deleteColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        yield prisma.color.delete({ where: { id } });
        res.json({ message: 'Color deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteColor = deleteColor;
