import Router from "express";
const router = Router();
import  { addToCart, clearCart, getCart } from './cart.controller';
import { authenticate } from "../../Middlewares/auth";

router.post('/',authenticate,(req, res, next) => {
    addToCart(req, res).catch(next);
});
router.get('/', authenticate, (req, res, next) => {
     getCart(req, res).catch(next);
});
router.delete('/clear', authenticate, (req, res, next) => {
     clearCart(req, res).catch(next);
});
export default router;