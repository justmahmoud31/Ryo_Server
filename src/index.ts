import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Bootstrap } from './Modules/Bootstrap';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import { setupSwagger } from './Config/swagger';
import path from 'path';

const app = express();
const prisma = new PrismaClient();
configDotenv();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check route
app.get('/', (req, res) => {
    res.send('Hello');
});
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
const PORT = process.env.PORT || 3000;
setupSwagger(app);
async function startServer() {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully.');
        Bootstrap(app);
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to connect to the database:', error);
        process.exit(1); 
    }
}

startServer();
