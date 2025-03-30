import useThemeStore from "../store/themeStore";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();
console.log(theme, "EL THEME Desde el ThemeToggle")
  return (
    <button
      onClick={toggleTheme}
      className=''
    >
      {theme === "light" ? (
        <FaMoon color="Black" className='' />
      ) : (
        <FaSun color="Orange" className='h-6 w-6 text-yellow-400' />
      )}
    </button>
  );
};

export default ThemeToggle;
