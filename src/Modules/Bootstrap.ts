import { Express } from 'express';
import authRouter from './Auth/auth.routes';
import userRouter from './Users/user.routes';
import categoryRouter from './Category/category.routes';
export const Bootstrap = (app: Express): void => {
    app.use('/api/auth', authRouter);
    app.use('/api/users', userRouter);
    app.use('/api/categories', categoryRouter);
}