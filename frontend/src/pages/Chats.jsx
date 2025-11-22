import { useContext, useEffect, useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { AuthContext } from '../context/ContextProvider';
import { useNavigate } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/20/solid';
const imageUrl =
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

export const Chats = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const backendUrlChats = `${API_URL}/chats`;
  const backendUrlUsers = `${API_URL}/users`;
  const { accessToken, usuarioAuth } = useContext(AuthContext);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [query, setQuery] = useState(''); // texto que escribe el usuario
  const [results, setResults] = useState([]); // resultados de la búsqueda
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  const handleChat = (name) => {
    //verificar si existe el chat
    //sino crearlo
    createChat(name);

    // navigate(`/chats/${id}`);
  };

  const handleOpenChat = (chat) => {
    let name = chat.users[0].name;
    navigate(`/chats/${chat._id}`, {
      state: { name },
    });
  };
  const createChat = async (name) => {
    try {
      const res = await fetch(backendUrlChats, {
        method: 'POST',
        body: JSON.stringify({ users: [name] }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      console.log('chats creado resp:', data);
    } catch (error) {}
  };

  // console.log('token:', accessToken);
  const get = async () => {
    // NECESSITO  TENER EL TOKEN GUARDADO EN CONTEXTO
    try {
      const res = await fetch(backendUrlChats, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      console.log('type:', Array.isArray(data));

      setChats(data);
      console.log('chats:', data);
    } catch (error) {
      console.log(error);
    }
  };

  // función que se ejecuta cuando el usuario escribe
  const handleChange = (e) => {
    setQuery(e.target.value); // guardamos el texto
  };

  // cada vez que el texto cambia, hacemos el GET (si hay texto)
  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        const res = await fetch(`${backendUrlUsers}?name=${query}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        console.log(data);
        setResults(data);
      } catch (error) {
        console.error('Error buscando:', error);
      }
    };

    fetchResults();
  }, [query]);

  useEffect(() => {
    // console.log('Token actual:', accessToken);
    get();
  }, [accessToken]); // tokem como dependencia asi se ejecuta una vez lo tengamos

  return (
    <>
      <SearchBar
        onFocusChange={setIsSearchFocused}
        handleChange={handleChange}
      />
      {isSearchFocused ? (
        <div className='ml-4 py-4 pl-1 mt-2'>
          {results.length > 0 ? (
            <ul role='list' className='divide-y divide-white/5'>
              {results.map((r, i) => (
                <li
                  key={i}
                  className='flex justify-between gap-x-4 py-4 px-3 active:bg-gray-800 transition rounded-xl cursor-pointer select-none'
                  onClick={() => handleChat(r.name)}
                >
                  <div className='flex min-w-0 gap-x-4'>
                    <img
                      alt=''
                      src={imageUrl}
                      className='size-12 flex-none rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10'
                    />
                    <div className='min-w-0 flex-auto'>
                      <p className='text-sm/6 font-semibold text-white'>
                        {r.name &&
                          r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                      </p>
                      <p className='mt-1 truncate text-xs/5 text-gray-400'>
                        {/* {person.email} */}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-400'>Escribí para buscar...</p>
          )}
        </div>
      ) : (
        <div className='ml-4 py-4 pl-1 mt-2'>
          <ul role='list' className='divide-y divide-white/5'>
            {chats.map((chat, i) => {
              // 1️⃣ Identificar al otro usuario del chat
              const otherUser = chat.users.find((u) => u.id !== usuarioAuth.id);

              // 2️⃣ Último mensaje del chat
              const lastMessage =
                chat.lastMessage?.content || 'No messages yet';
              const lastDate = chat.lastMessage?.createdAt
                ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '';

              return (
                <li
                  key={i}
                  className='flex justify-between items-center gap-x-4 py-3 px-3 
                   hover:bg-gray-800 active:bg-gray-700
                   rounded-xl cursor-pointer transition select-none'
                  onClick={() => handleOpenChat(chat)}
                >
                  {/* Izquierda: avatar + info */}
                  <div className='flex min-w-0 gap-x-4 items-center'>
                    <img
                      alt={otherUser?.name}
                      src={imageUrl}
                      className='size-12 rounded-full bg-gray-800 shadow'
                    />

                    <div className='min-w-0 flex-auto'>
                      <p className='text-sm font-semibold text-white truncate'>
                        {otherUser?.name}
                      </p>
                      <div className='flex items-center'>
                        {chat.lastMessage?.sender === usuarioAuth.id && (
                          <CheckIcon className='text-white size-4 mr-1' />
                        )}

                        <p className='mt-0.5 text-xs text-gray-400 truncate'>
                          {lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Derecha: Hora */}
                  <div className='flex flex-col items-end'>
                    <p className='text-xs text-gray-400'>{lastDate}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};
