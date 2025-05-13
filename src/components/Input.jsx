const Input = ({ label, type = "text", name, value, onChange, placeholder }) => {
    return (
      <div className="relative w-full">
        <label className="block mb-1 text-sm">
          {label}
        </label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder} // ✅ Ahora el placeholder es visible inicialmente
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f2023] text-gray-800 dark:text-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
          required
        />
      </div>
    );
  };
  
  export default Input;
  