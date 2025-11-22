// AppRouter.jsx
import { useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
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
  const { accessToken } = useContext(AuthContext);

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      {/* <Route path='/chats' element={<Chats />} /> */}
      {/* <Route path='/chats/:id' element={<Chat />} /> */}

      {/* Ruta protegida */}
      {/* 🔒 Ruta protegida */}
      <Route
        path='/chats'
        element={accessToken ? <Chats /> : <Navigate to='/login' />}
      />
      <Route
        path='/chats/:id'
        element={accessToken ? <Chats /> : <Navigate to='/login' />}
      />

      {/* Error 404 */}
      <Route path='*' element={<h1>Error 404: Page not found</h1>} />
    </Routes>
  );
};
