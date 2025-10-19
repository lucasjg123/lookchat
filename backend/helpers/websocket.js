import { Server } from 'socket.io';

export function initWebSocket(server) {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL },
  });
  // cuando se conecte un cliente
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    // escuchamos el evento 'message'
    socket.on('message', (data) => {
      console.log(data);
      // retransmitimos el msj a todos los demas destinatarios excepto al remitente
      socket.broadcast.emit('message', {
        body: data, // aca va el data del msj (contenido)
        from: socket.id.slice(6), // id del remitente
      });
    });
    // Limpieza cuando el cliente se desconecta
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}
