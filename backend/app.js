// solo crea la app express
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { loaderApp } from './helpers/loader.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Cargar rutas y modelos
loaderApp(app);

export default app;
