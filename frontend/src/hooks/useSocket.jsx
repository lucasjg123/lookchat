import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function useSocket(onMessage) {
  // useRef mantiene la misma referencia entre renderizados
  const socketRef = useRef(null);

  useEffect(() => {
    // 1️⃣ Se crea el socket una sola vez al montar el componente
    console.log('🔌 Creando conexión WebSocket...');
    const socket = io('http://localhost:3000');
    socketRef.current = socket;

    // 2️⃣ Escuchamos el evento 'message' del servidor. Cada vez que el backend emite un evento "message", el hook lo recibe y llama:
    socket.on('message', (data) => {
      if (typeof onMessage === 'function') {
        onMessage(data); // hanldeIncomingMessage() de App.jsx
      }
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
