import React from 'react';

const Button = ({ children, className, ...props }) => {
  return (
    <button
      {...props}
      className={`w-auto h-14 text-xl font-bold px-6 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 ${className}` }
    >
      {children}
    </button>
  );
}

export default Button;