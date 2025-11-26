import { InputChat } from '../components/ui';
import { HeaderChat } from '../components/HeaderChat';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useCrud } from '../hooks/useCrud'; // <-- importamos el hook
import { AuthContext } from '../context/ContextProvider';
import { useSocket } from '../hooks/useSocket.jsx';

export const Chat = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const backendUrl = `${API_URL}/messages`;
  const navigate = useNavigate();
  const { id } = useParams(); // <-- ID real del chat
  const { state } = useLocation(); // <-- chat pasado opcionalmente
  const name = state?.name; // puede no existir
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { accessToken, usuarioAuth } = useContext(AuthContext);
  // usamos el hook genérico. articulos -> items retornados de useCrud()
  const { getByPath, create } = useCrud(backendUrl, accessToken);
  const messagesEndRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // creo el msj
    const newMessage = { content: message, chat: id };

    // mandar al backend (REST)
    const saved = await create(newMessage);
    // console.log('msg bd:', saved);

    // agregarlo a tu UI (imperativo)
    setMessages((prev) => [...prev, saved]);

    // 3️⃣ enviar por WebSocket
    socket.emit('send-message', {
      chatId: id,
      message: saved,
    });

    setMessage('');
  };
  useEffect(() => {
    if (!name) {
      // si NO vino de navigate, se hace el GET
      fetch(`/api/chats/${id}`)
        .then((res) => res.json())
        .then((data) => console.log('chat cargado:', data));
      // guadar en id
    }
  }, [id, name]);

  // obtener msgs al montar
  useEffect(() => {
    const loadMessages = async () => {
      const msgs = await getByPath(`chat/${id}`);
      setMessages(msgs); // ⬅ unificamos acá
    };

    loadMessages();
  }, [id]);

  const handleBack = () => {
    navigate(`/chats`);
  };

  // manejardor para msg websocket
  const handleIncomingMessage = useCallback((data) => {
    setMessages((prev) => [...prev, data]);
    console.log('msg desde websocket', data);
  }, []);

  // Creamos el socket usando el hook
  const socket = useSocket(id, handleIncomingMessage);
  // func para mandar a /chats

  // para mostrar siempre el scroll abajo
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className='flex flex-col h-screen'>
      {/* HEADER */}
      <HeaderChat back={handleBack} name={name} />

      {/* CHAT (scroll) */}
      <div className='overflow-y-auto flex-1 px-4 py-2' ref={messagesEndRef}>
        <ul>
          {messages.map((msg, i) => (
            <li
              key={i}
              className={`my-2 p-2 table rounded-md ${
                msg.sender === usuarioAuth.id
                  ? 'bg-sky-700 ml-auto mr-3'
                  : 'bg-green-950 mr-auto ml-2'
              }`}
            >
              <span className='text-md text-white mr-2'>{msg.content}</span>
              <span className='text-xs text-gray-300'>{msg.createdAt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* INPUT */}
      <form
        onSubmit={handleSubmit}
        className='flex p-3 border-t border-gray-700'
      >
        <InputChat
          name='message'
          type='text'
          value={message}
          placeholder='write your message...'
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type='submit' className='pl-3 text-white'>
          Enviar
        </button>
      </form>
    </div>
  );
};
