import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
export const createColor = async (req: Request, res: Response) => {
  try {
    const { name, hex } = req.body;
    const color = await prisma.color.create({ data: { name, hex } });
    res.status(201).json(color);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /colors:
 *   get:
 *     summary: Retrieve a list of product colors
 *     description: Returns a list of product colors, optionally filtered by ID or name.
 *     tags:
 *       - Colors
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
export const getColors = async (req: Request, res: Response) => {
  try {
    const { id, name } = req.query;

    const filters: any = {};
    if (id) filters.id = parseInt(id as string);
    if (name) filters.name = { contains: name as string, mode: 'insensitive' };

    const colors = await prisma.color.findMany({ where: filters });
    res.json(colors);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /colors/{id}:
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
export const updateColor = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, hex } = req.body;
    const color = await prisma.color.update({
      where: { id },
      data: { name, hex },
    });
    res.json(color);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /colors/{id}:
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
export const deleteColor = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.color.delete({ where: { id } });
    res.json({ message: 'Color deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
