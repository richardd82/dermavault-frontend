import React from 'react';

const Button = ({ children, className, ...props }) => {
  return (
    <button
      {...props}
      className={`w-full py-2 bg-[#a78bfa] dark:bg-[#4f46e5] text-white rounded-lg hover:opacity-80 hover:scale-95 transition ${className}` }
    >
      {children}
    </button>
  );
}

export default Button;