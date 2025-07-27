import express from "express";
import {
    createOffer,
    getAllOffers,
    updateOffer,
    deleteOffer,
} from "./offer.controller";
import { authenticate, authorizeRoles } from "../../Middlewares/auth";

const router = express.Router();

router.post("/", authenticate, authorizeRoles("ADMIN"), createOffer);
router.get("/", getAllOffers);
router.patch("/:id",authenticate, authorizeRoles("ADMIN"), updateOffer);
router.delete("/:id",authenticate, authorizeRoles("ADMIN"), deleteOffer);

export default router;
/**
 * @swagger
 * tags:
 *   name: Offers
 *   description: Offer management endpoints
 */

/**
 * @swagger
 * /api/offers:
 *   post:
 *     summary: Create a new offer
 *     tags: [Offers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - discount
 *               - productId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               discount:
 *                 type: number
 *                 format: float
 *               productId:
 *                 type: integer
 *               messageId:
 *                 type: integer
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Offer created successfully
 *       500:
 *         description: Failed to create offer
 */

/**
 * @swagger
 * /api/offers:
 *   get:
 *     summary: Get all offers with optional filters
 *     tags: [Offers]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: Filter by offer ID
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *         description: Filter by product ID
 *       - in: query
 *         name: messageId
 *         schema:
 *           type: integer
 *         description: Filter by message ID
 *       - in: query
 *         name: expired
 *         schema:
 *           type: boolean
 *         description: Filter by expired status (true = expired, false = active)
 *     responses:
 *       200:
 *         description: List of offers
 *       500:
 *         description: Failed to fetch offers
 */

/**
 * @swagger
 * /api/offers/{id}:
 *   patch:
 *     summary: Update an existing offer
 *     tags: [Offers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Offer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               discount:
 *                 type: number
 *               productId:
 *                 type: integer
 *               messageId:
 *                 type: integer
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Offer updated successfully
 *       500:
 *         description: Failed to update offer
 */

/**
 * @swagger
 * /api/offers/{id}:
 *   delete:
 *     summary: Delete an offer
 *     tags: [Offers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Offer ID
 *     responses:
 *       200:
 *         description: Offer deleted successfully
 *       500:
 *         description: Failed to delete offer
 */
