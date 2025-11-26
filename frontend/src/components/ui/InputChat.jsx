export const InputChat = (props) => {
  return (
    <input
      {...props}
      className='w-full bg-transparent placeholder:text-slate-400 border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow text-white text-base'
    />
  );
};
