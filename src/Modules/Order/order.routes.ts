import express from 'express';
import {
    createOrder,
    getOrders,
    updateOrder,
    getUsersOrder,
    deleteAdminOrder,
    deleteUserOrder,
} from './order.controller';
import { authenticate, authorizeRoles } from '../../Middlewares/auth';

const router = express.Router();

router.post('/', authenticate, (req, res, next) => {
    createOrder(req, res).catch(next);
}
);
router.get('/', authenticate, authorizeRoles('ADMIN'), getOrders);
router.get('/me', authenticate, getUsersOrder);
router.put('/:id', authenticate, authorizeRoles('ADMIN'), updateOrder);
router.delete('/admin/:id', authenticate, (req,res,next)=>{
    deleteAdminOrder(req, res).catch(next);
});
router.delete('/:id', authenticate, (req,res,next)=>{
    deleteUserOrder(req, res).catch(next);
});
export default router;
