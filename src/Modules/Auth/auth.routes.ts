import { Router, Request, Response, NextFunction } from 'express';
import authController from './auth.controller'


const router = Router();

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
    authController.register(req, res).catch(next);
});
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    authController.login(req, res).catch(next)
});
// router.post('/reset-password', );
// router.post('/change-password',  );

export default router;
