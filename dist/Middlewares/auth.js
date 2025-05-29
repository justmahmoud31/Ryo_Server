"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Extend Express Request interface to include 'user'
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
        res.sendStatus(401);
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded; // you'll need to define the custom user type on req below
        next();
    }
    catch (err) {
        res.status(403).json({ message: 'Invalid token' });
        return;
    }
};
exports.authenticate = authenticate;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !roles.includes(user.role)) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
