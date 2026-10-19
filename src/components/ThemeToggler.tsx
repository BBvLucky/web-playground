import { useT } from "next-i18next/client";

import { useTheme } from "@/providers/ThemeProvider";

function ThemeToggler() {
  const { theme, setTheme } = useTheme();
  const { t } = useT("common");

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
          <span>{t("themeToggler.light")}</span>
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
          <span>{t("themeToggler.dark")}</span>
        </button>
        <button
          onClick={() => setTheme("system")}
          title={t("themeToggler.system")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
            theme === "system"
              ? "bg-white dark:bg-neutral-800 shadow-sm text-neutral-900 dark:text-neutral-100"
              : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          }`}
        >
          <span>💻</span>
          <span>{t("themeToggler.system")}</span>
        </button>
      </div>
    </div>
  );
}

export default ThemeToggler;
