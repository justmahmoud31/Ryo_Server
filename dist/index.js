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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const Bootstrap_1 = require("./Modules/Bootstrap");
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const swagger_1 = require("./Config/swagger");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
(0, dotenv_1.configDotenv)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// Health check route
app.get('/', (req, res) => {
    res.send('Hello');
});
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
const PORT = process.env.PORT || 3000;
(0, swagger_1.setupSwagger)(app);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.$connect();
            console.log('✅ Database connected successfully.');
            (0, Bootstrap_1.Bootstrap)(app);
            app.listen(PORT, () => {
                console.log(`🚀 Server running on port ${PORT}`);
            });
        }
        catch (error) {
            console.error('❌ Failed to connect to the database:', error);
            process.exit(1);
        }
    });
}
startServer();
