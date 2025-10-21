import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ===================
// 🔹 Swagger Config
// ===================
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Firebase Auth API',
      version: '1.0.0',
      description: 'API REST de autenticación con Firebase',
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===================
// 🔹 Rutas
// ===================
app.use('/api/auth', authRoutes);

export default app;
