const Input = ({ label, type = "text", name, value, onChange, placeholder }) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder} // ✅ Ahora el placeholder es visible inicialmente
          className="peer w-full border border-gray-300 dark:border-gray-600 dark:bg-white dark:text-black 
                     rounded-md px-4 pt-5 pb-2 outline-none transition-all duration-200
                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <label
          className="absolute left-4 top-5 text-gray-500 text-sm transition-all duration-200
                     peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                     peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
        >
          {label}
        </label>
      </div>
    );
  };
  
  export default Input;
  