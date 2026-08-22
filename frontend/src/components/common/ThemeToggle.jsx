import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="
        group
        relative
        flex
        h-9
        w-9
        cursor-pointer
        items-center
        justify-center
        rounded-full
        border
        border-gray-200
        bg-gray-50
        text-gray-700
        shadow-sm
        transition-all
        duration-200
        hover:scale-105
        hover:border-indigo-200
        hover:bg-indigo-50
        hover:text-indigo-600
        dark:border-gray-700
        dark:bg-gray-800
        dark:text-yellow-400
        dark:hover:border-gray-600
        dark:hover:bg-gray-700
        dark:hover:text-yellow-300
      "
    >
      <span
        className="
          absolute
          inset-0
          rounded-full
          opacity-0
          ring-2
          ring-indigo-200
          transition-opacity
          duration-200
          group-hover:opacity-100
          dark:ring-gray-600
        "
      />

      {isDark ? (
        <Sun className="relative h-[18px] w-[18px] transition-transform duration-200 group-hover:rotate-12" />
      ) : (
        <Moon className="relative h-[18px] w-[18px] transition-transform duration-200 group-hover:-rotate-12" />
      )}
    </button>
  );
}

export default ThemeToggle;
