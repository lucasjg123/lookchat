import { useContext, useEffect, useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { AuthContext } from '../context/ContextProvider';
import { useNavigate } from 'react-router-dom';
const imageUrl =
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
const people = [
  {
    name: 'Leslie Alexander',
    email: 'leslie.alexander@example.com',
    role: 'Co-Founder / CEO',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    name: 'Michael Foster',
    email: 'michael.foster@example.com',
    role: 'Co-Founder / CTO',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    name: 'Dries Vincent',
    email: 'dries.vincent@example.com',
    role: 'Business Relations',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: null,
  },
  {
    name: 'Lindsay Walton',
    email: 'lindsay.walton@example.com',
    role: 'Front-end Developer',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    name: 'Courtney Henry',
    email: 'courtney.henry@example.com',
    role: 'Designer',
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    role: 'Director of Product',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: null,
  },
];

export const Chats = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const backendUrlChats = `${API_URL}/chats`;
  const backendUrlUsers = `${API_URL}/users`;
  const { accessToken } = useContext(AuthContext);
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
    } catch (error) {}
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
            {chats.map((chat, i) => (
              <li
                key={i}
                className='flex justify-between gap-x-4 py-4 px-3 active:bg-gray-800 transition rounded-xl cursor-pointer select-none'
                onClick={() => handleOpenChat(chat)}
              >
                <div className='flex min-w-0 gap-x-4'>
                  <img
                    alt=''
                    src={imageUrl}
                    className='size-12 flex-none rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10'
                  />
                  <div className='min-w-0 flex-auto'>
                    <p className='text-sm/6 font-semibold text-white'>
                      {chat.users[0].name}
                    </p>
                    <p className='mt-1 truncate text-xs/5 text-gray-400'>
                      {'asdf'}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
