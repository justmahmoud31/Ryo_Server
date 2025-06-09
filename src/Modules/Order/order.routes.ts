import express from 'express';
import {
    createOrder,
    getOrders,
    updateOrder,
    deleteOrder,
    getUsersOrder,
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
router.delete('/:id', authenticate, (req,res,next)=>{
    deleteOrder(req, res).catch(next);
});

export default router;
