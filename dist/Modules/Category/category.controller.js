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
const client_1 = require("@prisma/client");
/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */
const prisma = new client_1.PrismaClient();
/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Add a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Electronics"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Category created successfully
 */
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required' });
        }
        const image = req.file.path; // Save the path of the uploaded file
        const category = yield prisma.category.create({
            data: { name, image }
        });
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to add category', error });
    }
});
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { name } = req.body;
        const data = { name };
        const category = yield prisma.category.update({
            where: { id },
            data,
        });
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update category', error });
    }
});
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name } = req.query;
    const filters = {};
    if (id)
        filters.id = Number(id);
    if (name)
        filters.name = { contains: String(name), mode: 'insensitive' };
    const categories = yield prisma.category.findMany({ where: filters });
    res.json(categories);
});
/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted successfully
 */
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    yield prisma.category.delete({ where: { id } });
    res.json({ message: 'Category deleted successfully' });
});
exports.default = { addCategory, getCategories, updateCategory, deleteCategory };
