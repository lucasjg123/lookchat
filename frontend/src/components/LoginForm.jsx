import { Label, Button, Input, Link } from './ui';

export const LoginForm = ({ buttonText = 'Sign in' }) => {
  return (
    <>
      <div>
        <Label htmlFor='email'>Email address</Label>
        <div className='mt-2'>
          <Input
            id='email'
            name='email'
            type='email'
            required
            autoComplete='email'
          ></Input>
        </div>
      </div>

      <div>
        <div className='flex items-center justify-between'>
          <Label htmlFor='password'>Password</Label>
          <div className='text-sm'>
            <Link href='#'>Forgot password?</Link>
          </div>
        </div>
        <div className='mt-2'>
          <Input
            id='password'
            name='password'
            type='password'
            required
            autoComplete='current-password'
          />
        </div>
      </div>

      <div>
        <Button type='submit'>{buttonText}</Button>
      </div>
    </>
  );
};
