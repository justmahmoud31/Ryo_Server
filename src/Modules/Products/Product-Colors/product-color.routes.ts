import { NextFunction, Request, Response, Router } from "express";
import { createColor } from "./product-color.controller";

const router = Router();
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    await createColor(req, res).catch(next);
});
export default router;