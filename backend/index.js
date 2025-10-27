//Crea el servidor HTTP y websocket
import http from 'http';
import dotenv from 'dotenv';
import app from './app.js';
import { initWebSocket } from './helpers/websocket.js';
import { connection } from './helpers/connectionMDB.js';
dotenv.config();

const server = http.createServer(app);
connection();
initWebSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
