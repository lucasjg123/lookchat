import express from 'express';
import { Server } from 'socket.io'; // para crear servidor websocket
import http from 'http'; // el server http de express no es compatible con el de socket xeso ahcemos esto

// creamos server http
const app = express();
const server = http.createServer(app);
// creamos el server websocket
const websocketServer = new Server(server, {
  cors: { origin: 'http://localhost:5173' },
}); // meteer en .env ver si hay otra forma

// crear esto en un helper?
// cuando se conecte un cliente
websocketServer.on('connection', (socket) => {
  console.log('Client coneected' + socket.id);
  // escuchamos el evento 'message'
  socket.on('message', (data) => {
    // retransmitimos el msj a todos los demas destinatarios excepto al remitente
    console.log(data);
    socket.broadcast.emit('message', {
      body: data, // aca va el data del msj (contenido)
      from: socket.id.slice(6), // id del remitente
    });
  });

  // Limpieza cuando el cliente se desconecta
  socket.on('disconnect', () => {
    console.log('Client disconnected: ' + socket.id);
  });
});

server.listen(3000);
console.log('Server on port', 3000);
