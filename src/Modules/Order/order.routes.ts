import express from 'express';
import {
    createOrder,
    getOrders,
    updateOrder,
    deleteOrder,
} from './order.controller';
import { authenticate, authorizeRoles } from '../../Middlewares/auth';

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/', authenticate, authorizeRoles('ADMIN'), getOrders);
router.put('/:id', authenticate, authorizeRoles('ADMIN'), updateOrder);
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), deleteOrder);

export default router;
