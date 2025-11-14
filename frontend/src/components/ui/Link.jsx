export const Link = ({ children, ...props }) => {
  return (
    <a
      {...props}
      className='font-semibold text-indigo-400 hover:text-indigo-300'
    >
      {children}
    </a>
  );
};
