import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { loaderApp } from './helpers/loader.js';
import { initWebSocket } from './helpers/websocket.js';
import { connection } from './helpers/connectionMDB.js';

dotenv.config();
connection(); // conectamos mongodb

const app = express();
// habilitar CORS para la API REST
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
// Cargamos rutas, modelos, middlewares, etc de la api
loaderApp(app);
// montamos la app rest sobre el server http
const server = http.createServer(app);

// inicializar el websocket server
initWebSocket(server);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
