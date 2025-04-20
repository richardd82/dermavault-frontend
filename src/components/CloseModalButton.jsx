import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import clsx from "clsx";  

const CloseModalButton = ({onClick, className =""}) => {
  return (
    <div className={clsx('absolute bg-[#a78bfa] dark:bg-[#4f46e5] rounded-full w-10 h-10', className)}>
      <button
        onClick={onClick}
        className='p-[.3rem]  rounded-full text-white hover:text-gray-700 dark:text-[gray-300] dark:hover:text-gray-100 transition'
      >
        <IoCloseSharp size={30} />
      </button>
    </div>
  );
};

export default CloseModalButton;
