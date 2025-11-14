export const Label = ({ children, ...props }) => {
  return (
    <label {...props} className='block text-sm/6 font-medium text-gray-100'>
      {children}
    </label>
  );
};
