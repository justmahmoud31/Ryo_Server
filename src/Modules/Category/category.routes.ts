import { NextFunction, Request, Response, Router } from 'express';
import categoryController from './category.controller';
import { upload } from '../../Config/multerConfig';
import { authenticate, authorizeRoles } from '../../Middlewares/auth';



const router = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories with optional filters
 *     tags: [Categories]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/', categoryController.getCategories);

router.post('/', authenticate, authorizeRoles('ADMIN'), upload.single('image'), (req: Request, res: Response, next: NextFunction) => {
    categoryController.addCategory(req, res).catch(next);
});

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Category updated successfully
 */

router.put('/:id', authenticate, authorizeRoles('ADMIN'), upload.single('image'), categoryController.updateCategory);

router.delete('/:id', authenticate, authorizeRoles('ADMIN'), categoryController.deleteCategory);

export default router;
