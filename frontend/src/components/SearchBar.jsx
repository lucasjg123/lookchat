import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { InputChat } from './ui';

export const SearchBar = ({ isFocused, onFocusChange, handleChange }) => {
  return (
    <>
      <div className='w-full max-w-sm min-w-[200px] pr-4 mx-auto mt-7 flex items-center'>
        {isFocused && (
          <div
            className='p-2 rounded-xl active:bg-gray-800 transition cursor-pointer select-none flex items-center justify-center mr-2'
            onClick={() => onFocusChange(false)}
          >
            <ArrowLeftIcon className='text-white size-6' />
          </div>
        )}

        <div className='relative flex items-center w-full'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='absolute w-5 h-5 top-2.5 left-2.5 text-slate-600'
          >
            <path d='M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z' />
          </svg>

          <InputChat
            placeholder='Search...'
            onFocus={() => onFocusChange(true)}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
};
