import { useCallback, useState } from 'react';
import useSocket from './hooks/useSocket.jsx';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  // Función que se llama cuando llega un mensaje desde el servidor. La enviamos al hook. Cada vez que el backend emite un evento "message", el hook lo recibe y llama:
  const handleIncomingMessage = useCallback((data) => {
    setMessages((prev) => [...prev, data]); // agrgamos el nuevo mensaje a la
  }, []);

  // Creamos el socket usando el hook
  const socket = useSocket(handleIncomingMessage);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = { body: message, from: 'Me' };
    setMessages((prev) => [...prev, newMessage]);
    socket.emit('message', message);
    setMessage('');
  };

  return (
    <div className='h-screen bg-zinc-800 text-white flex items-center justify-center'>
      <form onSubmit={handleSubmit} className='bg-zinc-900 p-10'>
        <h1 className='text-2xl font-bold my-2'>Chat en Tiempo Real</h1>
        <input
          type='text'
          value={message}
          placeholder='write your message...'
          onChange={(e) => setMessage(e.target.value)}
          className='border-2 border-zinc-500 p-2 w-full text-black'
        />
        <ul>
          {messages.map((msg, i) => (
            <li
              key={i}
              className={`my-2 p-2 table rounded-md ${
                msg.from === 'Me' ? 'bg-sky-700 ml-auto' : 'bg-black mr-auto'
              }`}
            >
              <span className='text-xs block text-slate-300'>{msg.from}:</span>
              <span className='text-md'>{msg.body}</span>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
};

export default App;
