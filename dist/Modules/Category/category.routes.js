"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = __importDefault(require("./category.controller"));
const multerConfig_1 = require("../../Config/multerConfig");
const auth_1 = require("../../Middlewares/auth");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories with optional filters
 *     tags: [Categories]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/', category_controller_1.default.getCategories);
router.post('/', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN'), multerConfig_1.upload.single('image'), (req, res, next) => {
    category_controller_1.default.addCategory(req, res).catch(next);
});
/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [Categories]
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
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router.put('/:id', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN'), multerConfig_1.upload.single('image'), category_controller_1.default.updateCategory);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN'), category_controller_1.default.deleteCategory);
exports.default = router;
