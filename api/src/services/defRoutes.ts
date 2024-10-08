import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import configSwagger from '../config/swagger-config';

const configureServices = (app: Application): void => {
  // Swagger documentation route
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(configSwagger));

  // Middleware for parsing requests
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Define application routes here
};

export default configureServices;
