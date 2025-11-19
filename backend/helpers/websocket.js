import { Server } from 'socket.io';

//dsp ampliar para implementar un token paraq valide los usuario y si estos pertence  al chat

export function initWebSocket(server) {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL },
  });
  // cuando se conecte un cliente
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // ⭐ 1) Un usuario se une a un chat específico
    socket.on('join-chat', ({ chatId }) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    // ⭐ 2) Enviar mensaje SOLO al chat correspondiente
    socket.on('send-message', ({ chatId, message }) => {
      // Se envía SOLO a los usuarios del room EXCEPTO al remitente
      socket.to(chatId).emit('receive-message', message);
      console.log(`Message sent to room ${chatId}`, message);
    });

    // // escuchamos el evento 'message'
    // socket.on('message', (data) => {
    //   console.log(data);
    //   // retransmitimos el msj a todos los demas destinatarios excepto al remitente
    //   socket.broadcast.emit('message', data);
    // });
    // Limpieza cuando el cliente se desconecta
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}
