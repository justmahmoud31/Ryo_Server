import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
export const createSize = async (req: Request, res: Response) => {
  try {
    const { label } = req.body;
    const size = await prisma.size.create({ data: { label } });
    res.status(201).json(size);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

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
export const getSizes = async (req: Request, res: Response) => {
  try {
    const { id, label } = req.query;

    const filters: any = {};
    if (id) filters.id = parseInt(id as string);
    if (label) filters.label = { contains: label as string, mode: 'insensitive' };

    const sizes = await prisma.size.findMany({ where: filters });
    res.json(sizes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};



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
export const updateSize = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { label } = req.body;
    const size = await prisma.size.update({ where: { id }, data: { label } });
    res.json(size);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

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
export const deleteSize = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.size.delete({ where: { id } });
    res.json({ message: 'Size deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
