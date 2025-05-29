"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = __importDefault(require("./users.controller"));
const auth_1 = require("../../Middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield users_controller_1.default.getAllUsers(req, res);
    }
    catch (err) {
        next(err);
    }
}));
router.post('/admin', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield users_controller_1.default.addAdmin(req, res);
}));
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield users_controller_1.default.deleteUser(req, res);
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
