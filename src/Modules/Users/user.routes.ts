import { NextFunction, Request, Response, Router } from 'express';
import userControllers from './users.controller';
import { authenticate, authorizeRoles } from '../../Middlewares/auth';
const router = Router();

router.get('/', authenticate, authorizeRoles('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userControllers.getAllUsers(req, res);
    } catch (err) {
        next(err);
    }
});
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userControllers.deleteUser(req, res);
    } catch (err) {
        next(err);
    }
});
export default router;