import { Express } from 'express';
import authRouter from './Auth/auth.routes';
import userRouter from './Users/user.routes';
import categoryRouter from './Category/category.routes';
import colorRouter from './Products/Product-Colors/product-color.routes';
import sizesRouter from './Products/Product-Sizes/product-size.routes'
import productRouter from './Products/product.routes';
import orderRouter from './Order/order.routes';
import  cartRouter  from './cart/cart.routes';
import governmentRouter from './government/government.routes';
import messageRouter from './Message/message.routes';
export const Bootstrap = (app: Express): void => {
    app.use('/api/auth', authRouter);
    app.use('/api/users', userRouter);
    app.use('/api/categories', categoryRouter);
    app.use('/api/colors', colorRouter);
    app.use('/api/sizes', sizesRouter);
    app.use('/api/products', productRouter);
    app.use('/api/orders', orderRouter);
    app.use('/api/cart', cartRouter);
    app.use('/api/governments', governmentRouter);
    app.use('/api/messages',messageRouter);
}