import { Request, Response, Router } from "express";
import { createMessage, deleteMessage, getMessages } from "./message.controller";


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Message management
 */

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get all messages
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   content:
 *                     type: string
 */
router.get("/", getMessages);
/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Hello, world!
 *               productId:
 *                 type: integer
 *                 nullable: true
 *                 example: 5
 *     responses:
 *       201:
 *         description: Message created
 *       400:
 *         description: Validation error
 */

router.post("/", (req:Request,res:Response)=>{
    createMessage(req,res);
});

/**
 * @swagger
 * /api/messages/{id}:
 *   delete:
 *     summary: Delete a message by ID
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Message deleted
 *       404:
 *         description: Message not found
 */
router.delete("/:id", (req:Request,res:Response)=>{
    deleteMessage(req,res)
});

export default router;
