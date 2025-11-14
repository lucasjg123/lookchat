import { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { AuthContext } from '../context/ContextProvider';
import { Logo, Title, Link } from '../components/ui';

export const Login = () => {
  const { login } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const backendUrl = `${API_URL}/users/login`;

  const [error, setError] = useState(false);
  const [exito, setExito] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    let user = {
      mail: e.target.email.value,
      password: e.target.password.value,
    };
    // console.log('user a enviar', user);
    handleLogin(user);
  };

  const handleLogin = async (user) => {
    try {
      const res = await fetch(backendUrl, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // deberiamos guardar el token en context
      const data = await res.json();
      // console.log('resp del back:', data);

      if (res.status == 200) {
        //cambiamos estado exito a true
        login(data); // guarda usuario y tokens
        navigate('/chats');
      } else {
        //mostrar error
      }
    } catch (error) {}
  };

  // useEffect para redirigir solo si exito es true
  useEffect(() => {
    if (exito) {
      navigate('/chats');
    }
  }, [exito, navigate]);

  return (
    <>
      <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <Logo />
          <Title>Sign in to your account</Title>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form onSubmit={onSubmit} className='space-y-6'>
            <LoginForm></LoginForm>
          </form>

          <p className='mt-10 text-center text-sm/6 text-gray-400'>
            Not a member? <Link href='#'>Start a 14 day free trial</Link>
          </p>
        </div>
      </div>
    </>
  );
};
