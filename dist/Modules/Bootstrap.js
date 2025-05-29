"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bootstrap = void 0;
const auth_routes_1 = __importDefault(require("./Auth/auth.routes"));
const user_routes_1 = __importDefault(require("./Users/user.routes"));
const category_routes_1 = __importDefault(require("./Category/category.routes"));
const product_color_routes_1 = __importDefault(require("./Products/Product-Colors/product-color.routes"));
const product_size_routes_1 = __importDefault(require("./Products/Product-Sizes/product-size.routes"));
const product_routes_1 = __importDefault(require("./Products/product.routes"));
const order_routes_1 = __importDefault(require("./Order/order.routes"));
const Bootstrap = (app) => {
    app.use('/api/auth', auth_routes_1.default);
    app.use('/api/users', user_routes_1.default);
    app.use('/api/categories', category_routes_1.default);
    app.use('/api/colors', product_color_routes_1.default);
    app.use('/api/sizes', product_size_routes_1.default);
    app.use('/api/products', product_routes_1.default);
    app.use('/api/orders', order_routes_1.default);
};
exports.Bootstrap = Bootstrap;
