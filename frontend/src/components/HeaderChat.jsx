import { ArrowLeftIcon } from '@heroicons/react/20/solid';

export const HeaderChat = ({ back, name }) => {
  return (
    <>
      <div className='flex min-w-0 py-5 px-3 items-center'>
        <div
          className='p-2 rounded-xl active:bg-gray-800 transition cursor-pointer select-none flex items-center justify-center mr-2'
          onClick={() => back()}
        >
          <ArrowLeftIcon className='text-white size-6' />
        </div>
        <img
          alt=''
          src={
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
          }
          className='size-12 flex-none rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10'
        />
        <div className='min-w-0 flex-auto'>
          <p className='text-sm/6 font-semibold text-white'>{name}</p>
          {/* <p className='mt-1 truncate text-xs/5 text-gray-400'>{'asdf'}</p> */}
        </div>
      </div>
    </>
  );
};
