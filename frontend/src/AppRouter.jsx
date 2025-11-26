// AppRouter.jsx
import { useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Home } from './pages/Home.jsx';
import { Chats } from './pages/Chats.jsx';
import { Chat } from './pages/Chat.jsx';
import { ContextProvider, AuthContext } from './context/ContextProvider.jsx';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <ContextProvider>
        <Router />
      </ContextProvider>
    </BrowserRouter>
  );
};

// Este componente sí está dentro de ContextProvider
const Router = () => {
  const { accessToken, loadingSession } = useContext(AuthContext);

  // hacer componente este loader
  if (loadingSession) {
    {
      console.log('loading session');
    }
    return (
      <div className='flex items-center justify-center h-screen bg-black text-white'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white'></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      {/* <Route path='/chats' element={<Chats />} /> */}
      {/* <Route path='/chats/:id' element={<Chat />} /> */}

      {/* 🔒 Rutas protegida */}
      <Route
        path='/chats'
        element={accessToken ? <Chats /> : <Navigate to='/login' />}
      />
      <Route
        path='/chats/:id'
        element={accessToken ? <Chat /> : <Navigate to='/login' />}
      />

      {/* Error 404 */}
      <Route path='*' element={<h1>Error 404: Page not found</h1>} />
    </Routes>
  );
};
