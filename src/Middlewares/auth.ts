import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request interface to include 'user'


const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const authenticate: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.sendStatus(401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: string;
      email: string;
    };
    req.user = decoded; // you'll need to define the custom user type on req below


    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
    return;
  }
}


export const authorizeRoles = (...roles: string[]): RequestHandler => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    next();
  };
};
