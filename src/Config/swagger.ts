import swaggerJSDoc from 'swagger-jsdoc';
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: process.env.SERVERURL, // Update your server URL
      },
    ],
  },
  // Path to the API docs
  apis: ['./src/Modules/**/*.ts'], // adjust path to your route/controller files
};

const swaggerSpec = swaggerJSDoc(options);
export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
export default swaggerSpec;
