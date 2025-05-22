import { NextFunction, Request, Response, Router } from "express";

import { authenticate, authorizeRoles } from "../../../Middlewares/auth";
import { createSize, deleteSize, getSizes, updateSize } from "./product-size.controller";

const router = Router();
router.post('/', authenticate, authorizeRoles('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    await createSize(req, res).catch(next);
});
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    await getSizes(req, res).catch(next);
});
router.patch('/:id', authenticate, authorizeRoles('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    await updateSize(req, res).catch(next);
});
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    await deleteSize(req, res).catch(next);
});
export default router;