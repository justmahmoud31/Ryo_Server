import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await prisma.message.findMany({
      include: {
        product: true, // populate related product
      },
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};


export const createMessage = async (req: Request, res: Response) => {
  const { content ,productId} = req.body;

  if (!content || typeof content !== "string") {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const message = await prisma.message.create({ data: { content,productId } });
    res.status(201).json(message);
  } catch {
    res.status(500).json({ error: "Failed to create message" });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existing = await prisma.message.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({ error: "Message not found" });
    }

    await prisma.message.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Message deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete message" });
  }
};
