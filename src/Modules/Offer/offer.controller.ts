import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/offers
export const createOffer = async (req: Request, res: Response) => {
  try {
    const { title, description, discount, productId, messageId, expiresAt } = req.body;

    const offer = await prisma.offer.create({
      data: {
        title,
        description,
        discount,
        productId,
        messageId,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      },
    });

    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ error: "Failed to create offer", details: error });
  }
};

// GET /api/offers?productId=1&messageId=3&id=2&expired=true
export const getAllOffers = async (req: Request, res: Response) => {
  try {
    const { id, productId, messageId, expired } = req.query;

    const filters: any = {};

    if (id) filters.id = Number(id);
    if (productId) filters.productId = Number(productId);
    if (messageId) filters.messageId = Number(messageId);
    if (expired === "true") filters.expiresAt = { lt: new Date() };
    if (expired === "false") filters.OR = [
      { expiresAt: { gte: new Date() } },
      { expiresAt: null },
    ];

    const offers = await prisma.offer.findMany({
      where: filters,
      include: {
        product: {
          include: {
            sizes: true,
            colors: true
          }
        }, message: true
      },
    });

    res.status(200).json({
      "Message": "Offers Retrived Succefully",
      offers
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch offers", details: error });
  }
};

// PATCH /api/offers/:id
export const updateOffer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, description, discount, productId, messageId, expiresAt } = req.body;

    const updatedOffer = await prisma.offer.update({
      where: { id },
      data: {
        title,
        description,
        discount,
        productId,
        messageId,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      },
    });

    res.status(200).json(updatedOffer);
  } catch (error) {
    res.status(500).json({ error: "Failed to update offer", details: error });
  }
};

// DELETE /api/offers/:id
export const deleteOffer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await prisma.offer.delete({ where: { id } });

    res.status(200).json({ message: "Offer deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete offer" });
  }
};
