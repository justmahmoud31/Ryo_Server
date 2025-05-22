import { NextFunction, Request, Response, Router } from "express";

import { authenticate, authorizeRoles } from "../../Middlewares/auth";
import { createProduct, deleteProduct, getProducts, updateProduct } from "./product.controller";
import { upload } from "../../Config/multerConfig";

const router = Router();
router.post(
    '/',
    authenticate,
    authorizeRoles('ADMIN'),
    upload.fields([
        { name: 'images', maxCount: 10 },
        { name: 'cover_Image', maxCount: 1 },
    ]),
    async (req: Request, res: Response, next: NextFunction) => {
        await createProduct(req, res).catch(next);
    }
);
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    await getProducts(req, res).catch(next);
});
router.patch('/:id', authenticate, authorizeRoles('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    await updateProduct(req, res).catch(next);
});
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    await deleteProduct(req, res).catch(next);
});
export default router;