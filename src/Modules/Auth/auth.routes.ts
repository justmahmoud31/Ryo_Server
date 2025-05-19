import { Router, Request, Response, NextFunction } from 'express';
import authController from './auth.controller'


const router = Router();

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
    authController.register(req, res).catch(next);
});
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    authController.login(req, res).catch(next)
});
router.post('/forgot-password', (req: Request, res: Response, next: NextFunction) => {
    authController.sendResetOTP(req, res).catch(next);
});
router.post('/reset-password', (req: Request, res: Response, next: NextFunction) => {
    authController.resetPassword(req, res).catch(next);
});

export default router;
