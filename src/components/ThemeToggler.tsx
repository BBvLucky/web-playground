import { useTheme } from "@/providers/ThemeProvider";

function ThemeToggler() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="px-3 py-1">
      <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-lg p-1">
        <button
          onClick={() => setTheme("light")}
          title="Светлая тема"
          className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
            theme === "light"
              ? "bg-white dark:bg-neutral-800 shadow-sm text-neutral-900 dark:text-neutral-100"
              : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          }`}
        >
          <span>☀️</span>
          <span>Светлая</span>
        </button>
        <button
          onClick={() => setTheme("dark")}
          title="Тёмная тема"
          className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
            theme === "dark"
              ? "bg-white dark:bg-neutral-800 shadow-sm text-neutral-900 dark:text-neutral-100"
              : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          }`}
        >
          <span>🌙</span>
          <span>Тёмная</span>
        </button>
        <button
          onClick={() => setTheme("system")}
          title="Как в системе"
          className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
            theme === "system"
              ? "bg-white dark:bg-neutral-800 shadow-sm text-neutral-900 dark:text-neutral-100"
              : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          }`}
        >
          <span>💻</span>
          <span>Системная</span>
        </button>
      </div>
    </div>
  );
}

export default ThemeToggler;
