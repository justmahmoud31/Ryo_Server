import { Express } from 'express';
import authRouter from './Auth/auth.routes';
import userRouter from './Users/user.routes';
import categoryRouter from './Category/category.routes';
import colorRouter from './Products/Product-Colors/product-color.routes';
import sizesRouter from './Products/Product-Sizes/product-size.routes'
import productRouter from './Products/product.routes'
export const Bootstrap = (app: Express): void => {
    app.use('/api/auth', authRouter);
    app.use('/api/users', userRouter);
    app.use('/api/categories', categoryRouter);
    app.use('/api/colors', colorRouter);
    app.use('/api/sizes', sizesRouter);
    app.use('/api/products', productRouter);
}