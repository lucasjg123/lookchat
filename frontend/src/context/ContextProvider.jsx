// AuthContext.jsx
import { createContext, useState, useEffect } from 'react';

// creamos el contexto
export const AuthContext = createContext();

export const ContextProvider = ({ children }) => {
  const [usuarioAuth, setUsuarioAuth] = useState(null); // datos del usuario logueado
  const [accessToken, setAccessToken] = useState(null); // token de acceso actual

  // 🔹 Función para hacer login y guardar los datos
  const login = (data) => {
    // console.log('login data:', data);
    // `data` viene del backend: { user, accessToken, refreshToken }
    setUsuarioAuth(data.user);
    setAccessToken(data.accessToken);

    // guardamos solo lo necesario en localStorage (ej. refreshToken + usuario)
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('usuario', JSON.stringify(data.user));
  };

  // 🔹 Función para cerrar sesión
  const logout = () => {
    setUsuarioAuth(null);
    setAccessToken(null);
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('usuario');
  };

  // 🔹 Rehidratar sesión al recargar la app
  const restoreSession = async () => {
    const usuario = localStorage.getItem('usuario');
    const refreshToken = localStorage.getItem('refreshToken');
    if (usuario && refreshToken) {
      try {
        // Pedimos nuevo accessToken al backend
        const res = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        const data = await res.json();
        if (res.ok) {
          setUsuarioAuth(JSON.parse(usuario));
          setAccessToken(data.accessToken);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error al refrescar token:', error);
        logout();
      }
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ usuarioAuth, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
