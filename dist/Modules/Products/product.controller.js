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
exports.updateProduct = exports.deleteProduct = exports.getProducts = exports.createProduct = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// @swagger
// tags:
//   name: Products
//   description: Product management
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - categoryId
 *               - price
 *               - stock
 *               - cover_Image
 *               - discreption
 *             properties:
 *               name:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               target_gender:
 *                 type: string
 *               Material:
 *                 type: string
 *               discreption:
 *                 type: string
 *               cover_Image:
 *                 type: string
 *                 format: binary
 *               colors:
 *                 type: array
 *                 items:
 *                   type: integer
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created
 *       500:
 *         description: Internal server error
 */
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, categoryId, price, stock, target_gender, Material, discreption, } = req.body;
        const parsedCategoryId = parseInt(categoryId);
        const parsedPrice = parseFloat(price);
        const parsedStock = parseInt(stock);
        const colors = (req.body.colors || '')
            .split(',')
            .map((id) => parseInt(id))
            .filter((id) => !isNaN(id));
        const sizes = (req.body.sizes || '')
            .split(',')
            .map((id) => parseInt(id))
            .filter((id) => !isNaN(id));
        // Handle uploaded images
        let uploadedImages = [];
        if (req.files && !Array.isArray(req.files) && typeof req.files === 'object' && 'images' in req.files) {
            uploadedImages = req.files['images'] || [];
        }
        const imageUrls = uploadedImages.map(file => `/uploads/products/${file.filename}`);
        // Handle cover image
        let coverImageFile;
        if (req.files &&
            !Array.isArray(req.files) &&
            typeof req.files === 'object' &&
            'cover_Image' in req.files) {
            coverImageFile = (_a = req.files['cover_Image']) === null || _a === void 0 ? void 0 : _a[0];
        }
        const coverImageUrl = coverImageFile ? `/uploads/products/${coverImageFile.filename}` : '';
        const product = yield prisma.product.create({
            data: {
                name,
                categoryId: parsedCategoryId,
                price: parsedPrice,
                stock: parsedStock,
                target_gender,
                Material,
                discreption,
                cover_Image: coverImageUrl,
                colors: {
                    create: colors.map((colorId) => ({ colorId })),
                },
                sizes: {
                    create: sizes.map((sizeId) => ({ sizeId })),
                },
                images: {
                    create: imageUrls.map((url) => ({ url })),
                }
            },
            include: { colors: true, sizes: true, images: true }
        });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createProduct = createProduct;
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with optional filters and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of products
 *       500:
 *         description: Internal server error
 */
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, categoryId, page = 1, limit = 10 } = req.query;
        const filters = {};
        if (name)
            filters.name = { contains: name, mode: 'insensitive' };
        if (categoryId)
            filters.categoryId = parseInt(categoryId);
        const products = yield prisma.product.findMany({
            where: filters,
            include: {
                colors: {
                    include: {
                        color: true, // Include actual color data
                    },
                },
                sizes: {
                    include: {
                        size: true, // Include actual size data
                    },
                },
                images: true,
            },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
        });
        res.json({
            message: "Products Retrived Succeffuly",
            data: products
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProducts = getProducts;
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        yield prisma.product.delete({ where: { id } });
        res.json({ message: 'Product deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteProduct = deleteProduct;
/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update a product
 *     tags: [Products]
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
 *               categoryId:
 *                 type: integer
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               target_gender:
 *                 type: string
 *               Material:
 *                 type: string
 *               discreption:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       500:
 *         description: Internal server error
 */
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const updatedProduct = yield prisma.product.update({
            where: { id },
            data: req.body
        });
        res.json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateProduct = updateProduct;
