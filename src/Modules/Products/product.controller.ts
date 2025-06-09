import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      categoryId,
      price,
      stock,
      target_gender,
      Material,
      discreption,
    } = req.body;

    const parsedCategoryId = parseInt(categoryId);
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock);

    const colors = (req.body.colors || "")
      .split(",")
      .map((id: string) => parseInt(id))
      .filter((id: number) => !isNaN(id));

    const sizes = (req.body.sizes || "")
      .split(",")
      .map((id: string) => parseInt(id))
      .filter((id: number) => !isNaN(id));

    // Handle uploaded images
    let uploadedImages: Express.Multer.File[] = [];
    if (
      req.files &&
      !Array.isArray(req.files) &&
      typeof req.files === "object" &&
      "images" in req.files
    ) {
      uploadedImages =
        (req.files as { [fieldname: string]: Express.Multer.File[] })[
          "images"
        ] || [];
    }
    const imageUrls = uploadedImages.map((file) => `/uploads/${file.filename}`);

    // Handle cover image
    let coverImageFile: Express.Multer.File | undefined;
    if (
      req.files &&
      !Array.isArray(req.files) &&
      typeof req.files === "object" &&
      "cover_Image" in req.files
    ) {
      coverImageFile = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )["cover_Image"]?.[0];
    }
    const coverImageUrl = coverImageFile
      ? `/uploads/${coverImageFile.filename}`
      : "";

    const product = await prisma.product.create({
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
          create: colors.map((colorId: number) => ({ colorId })),
        },
        sizes: {
          create: sizes.map((sizeId: number) => ({ sizeId })),
        },
        images: {
          create: imageUrls.map((url: string) => ({ url })),
        },
      },
      include: { colors: true, sizes: true, images: true },
    });

    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

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
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { name, categoryId, page = 1, limit = 10 } = req.query;
    const filters: any = {
      isDeleted: false,
    };

    if (name) {
      filters.name = { contains: name as string, mode: "insensitive" };
    }

    if (categoryId) {
      filters.categoryId = parseInt(categoryId as string);
    }

    const products = await prisma.product.findMany({
      where: filters,
      include: {
        colors: {
          include: {
            color: true,
          },
        },
        sizes: {
          include: {
            size: true,
          },
        },
        images: true,
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    res.json({
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

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
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.json({ message: "Product deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

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
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    res.json(updatedProduct);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
