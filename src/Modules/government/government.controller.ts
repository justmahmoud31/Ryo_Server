import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
/**
 * @swagger
 * tags:
 *   - name: Governments
 *     description: Government management endpoints
 */

const prisma = new PrismaClient();
/**
 * @swagger
 * /api/governments:
 *   post:
 *     summary: Create a new government
 *     tags:
 *       - Governments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Government created successfully
 *       400:
 *         description: Name is required or creation failed
 */
/**
 * @swagger
 * /api/governments:
 *   get:
 *     summary: Get all governments
 *     tags:
 *       - Governments
 *     responses:
 *       200:
 *         description: A list of governments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       500:
 *         description: Failed to fetch governments
 */
/**
 * @swagger
 * /api/governments/{id}:
 *   get:
 *     summary: Get a single government by ID
 *     tags:
 *       - Governments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Government retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       404:
 *         description: Government not found
 *       500:
 *         description: Error fetching government
 */
/**
 * @swagger
 * /api/governments/{id}:
 *   put:
 *     summary: Update a government
 *     tags:
 *       - Governments
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
 *         description: Government updated successfully
 *       400:
 *         description: Failed to update government
 */
/**
 * @swagger
 * /api/governments/{id}:
 *   delete:
 *     summary: Delete a government
 *     tags:
 *       - Governments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Government deleted successfully
 *       400:
 *         description: Failed to delete government
 */

export const createGovernment = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  try {
    const government = await prisma.government.create({ data: { name } });
    res.status(201).json(government);
  } catch (error) {
    res.status(400).json({ error: "Failed to create government", details: error });
  }
};

// Read all
export const getGovernments = async (_req: Request, res: Response) => {
  try {
    const governments = await prisma.government.findMany();
    res.status(200).json(governments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch governments" });
  }
};

// Read one
export const getGovernmentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const government = await prisma.government.findUnique({ where: { id: Number(id) } });
    if (!government) return res.status(404).json({ error: "Government not found" });
    res.status(200).json(government);
  } catch (error) {
    res.status(500).json({ error: "Error fetching government" });
  }
};

// Update
export const updateGovernment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updated = await prisma.government.update({
      where: { id: Number(id) },
      data: { name },
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: "Failed to update government", details: error });
  }
};

// Delete
export const deleteGovernment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.government.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Government deleted" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete government" });
  }
};
