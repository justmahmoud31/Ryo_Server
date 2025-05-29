"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const auth_1 = require("../../Middlewares/auth");
const router = express_1.default.Router();
router.post('/', auth_1.authenticate, order_controller_1.createOrder);
router.get('/', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN'), order_controller_1.getOrders);
router.put('/:id', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN'), order_controller_1.updateOrder);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN'), order_controller_1.deleteOrder);
exports.default = router;
