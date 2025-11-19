import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket(chatId, onMessage) {
  // useRef mantiene la misma referencia entre renderizados
  const socketRef = useRef(null);

  useEffect(() => {
    // crear socket
    console.log('🔌 Creando conexión WebSocket...');
    const socket = io('http://localhost:3000');
    socketRef.current = socket;

    // ⭐ Unirse al room del chat
    socket.emit('join-chat', { chatId });

    // ⭐ Escuchamos el evento 'receive-message' del servidor. Cada vez que el backend emite un evento , el hook lo recibe y llama:
    socket.on('receive-message', (data) => {
      onMessage(data);
    });

    // 3️⃣ Limpiamos la conexión al desmontar. El return se ejecuta solo cuando cierra la pagina, desmonta (es decir, cuando se elimina del DOM)
    return () => {
      socket.disconnect();
      console.log('Socket disconnected');
    };
  }, [onMessage]); // solo se reinicia si cambia la función callback

  // 4️⃣ Devolvemos la instancia del socket para emitir eventos
  return socketRef.current;
}
