import { useContext, useEffect, useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { AuthContext } from '../context/ContextProvider';
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
  const backendUrl = `${API_URL}/chats`;
  const { accessToken } = useContext(AuthContext);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [query, setQuery] = useState(''); // texto que escribe el usuario
  const [results, setResults] = useState([]); // resultados de la búsqueda

  // console.log('token:', accessToken);
  const get = async () => {
    // NECESSITO  TENER EL TOKEN GUARDADO EN CONTEXTO
    try {
      const res = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
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
        const res = await fetch(`${backendUrl}?name=${query}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
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
        <div className='flex-1 bg-gray-900 bg-opacity-95 z-10'>
          {/* contenido del overlay */}
        </div>
      ) : (
        <div className='chats ml-4 py-4 pl-1 mt-2'>
          <ul role='list' className='divide-y divide-white/5'>
            {people.map((person) => (
              <li
                key={person.email}
                className='flex justify-between gap-x-6 py-5'
              >
                <div className='flex min-w-0 gap-x-4'>
                  <img
                    alt=''
                    src={person.imageUrl}
                    className='size-12 flex-none rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10'
                  />
                  <div className='min-w-0 flex-auto'>
                    <p className='text-sm/6 font-semibold text-white'>
                      {person.name}
                    </p>
                    <p className='mt-1 truncate text-xs/5 text-gray-400'>
                      {person.email}
                    </p>
                  </div>
                </div>
                <div className='hidden shrink-0 sm:flex sm:flex-col sm:items-end'>
                  <p className='text-sm/6 text-white'>{person.role}</p>
                  {person.lastSeen ? (
                    <p className='mt-1 text-xs/5 text-gray-400'>
                      Last seen{' '}
                      <time dateTime={person.lastSeenDateTime}>
                        {person.lastSeen}
                      </time>
                    </p>
                  ) : (
                    <div className='mt-1 flex items-center gap-x-1.5'>
                      <div className='flex-none rounded-full bg-emerald-500/30 p-1'>
                        <div className='size-1.5 rounded-full bg-emerald-500' />
                      </div>
                      <p className='text-xs/5 text-gray-400'>Online</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
