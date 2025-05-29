"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const router = (0, express_1.Router)();
router.post('/register', (req, res, next) => {
    auth_controller_1.default.register(req, res).catch(next);
});
router.post('/login', (req, res, next) => {
    auth_controller_1.default.login(req, res).catch(next);
});
router.post('/forgot-password', (req, res, next) => {
    auth_controller_1.default.sendResetOTP(req, res).catch(next);
});
router.post('/reset-password', (req, res, next) => {
    auth_controller_1.default.resetPassword(req, res).catch(next);
});
exports.default = router;
