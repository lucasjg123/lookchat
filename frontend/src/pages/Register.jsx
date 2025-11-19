import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { Label, Input, Title, Link, Logo } from '../components/ui';

export const Register = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const backendUrl = `${API_URL}/users/register`;

  const [error, setError] = useState(false);
  const [exito, setExito] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    let user = {
      name: e.target.username.value,
      mail: e.target.email.value,
      password: e.target.password.value,
    };
    // console.log('user a enviar', user);
    register(user);
  };

  const register = async (user) => {
    try {
      const res = await fetch(backendUrl, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      console.log('resp del back:', data);

      if (res.status != 201) {
        //mostrar error
      } else {
        //cambiamos estado exito a true
      }
    } catch (error) {
      console.log(error);
      // mostrar error en el front
    }
  };

  // useEffect para redirigir solo si exito es true
  useEffect(() => {
    if (exito) {
      // alli en login mandar msj verificar mail sino q no se pueda logear
      navigate('/login');
    }
  }, [exito, navigate]);

  return (
    <>
      <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <Logo />
          <Title>Sign up to your account</Title>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form onSubmit={onSubmit} className='space-y-6'>
            <div>
              <Label htmlFor='username'>User name</Label>
              <div className='mt-2'>
                <Input
                  id='username'
                  name='username'
                  type='text'
                  required
                  autoComplete='username'
                />
              </div>
            </div>
            <LoginForm buttonText='Sign up' />
          </form>
          <p className='mt-10 text-center text-sm/6 text-gray-400'>
            Not a member? <Link href='#'>Start a 14 day free trial</Link>
          </p>
        </div>
      </div>
    </>
  );
};
