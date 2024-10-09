import express, { Application } from 'express';

import connectDB from './services/connectDB';
import startServeur from './services/serveur';
import configureServices from './services/defRoutes';


const app: Application = express();

connectDB();
configureServices(app);
startServeur(app);

export default app;
