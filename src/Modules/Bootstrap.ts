import { Express } from 'express';
import authRouter from './Auth/auth.routes';
export const Bootstrap = (app: Express): void => {
    app.use('/api/auth', authRouter);
}