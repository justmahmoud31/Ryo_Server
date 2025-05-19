import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */
const prisma = new PrismaClient();


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

const addCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required' });
        }
        const image = req.file.path;  // Save the path of the uploaded file

        const category = await prisma.category.create({
            data: { name, image }
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add category', error });
    }
}
const updateCategory = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name } = req.body;

        const data: any = { name };
       

        const category = await prisma.category.update({
            where: { id },
            data,
        });

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update category', error });
    }
};
const getCategories = async (req: Request, res: Response) => {
    const { id, name } = req.query;

    const filters: any = {};
    if (id) filters.id = Number(id);
    if (name) filters.name = { contains: String(name), mode: 'insensitive' };

    const categories = await prisma.category.findMany({ where: filters });
    res.json(categories);
};

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
const deleteCategory = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Category deleted successfully' });
};
export default { addCategory, getCategories, updateCategory, deleteCategory };