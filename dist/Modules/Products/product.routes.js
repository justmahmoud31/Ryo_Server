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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../Middlewares/auth");
const product_controller_1 = require("./product.controller");
const multerConfig_1 = require("../../Config/multerConfig");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN'), multerConfig_1.upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'cover_Image', maxCount: 1 },
]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, product_controller_1.createProduct)(req, res).catch(next);
}));
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, product_controller_1.getProducts)(req, res).catch(next);
}));
router.patch('/:id', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, product_controller_1.updateProduct)(req, res).catch(next);
}));
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, product_controller_1.deleteProduct)(req, res).catch(next);
}));
exports.default = router;
