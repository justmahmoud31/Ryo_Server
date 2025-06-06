import { NextFunction, Request, Response, Router } from "express";
import { createColor, deleteColor, getColors, updateColor } from "./product-color.controller";
import { authenticate, authorizeRoles } from "../../../Middlewares/auth";

const router = Router();
router.post('/', authenticate, authorizeRoles('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    await createColor(req, res).catch(next);
});
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    await getColors(req, res).catch(next);
});
router.patch('/:id', authenticate, authorizeRoles('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    await updateColor(req, res).catch(next);
});
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    await deleteColor(req, res).catch(next);
});
export default router;