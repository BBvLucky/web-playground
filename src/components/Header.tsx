import Dropdown from "./Dropdown";

export default function Header() {
  return (
    <header className="bg-bg-card border-b border-neutral-200 dark:border-neutral-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 transition-colors h-16">
      <div className="flex items-center gap-2">
        <span className="text-2xl">📊</span>
        <span className="font-bold text-lg hidden sm:block tracking-tight">
          Cryptocrap
        </span>
      </div>

      <div className="hidden md:block w-72">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-background border border-neutral-300 dark:border-neutral-800 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <Dropdown />
    </header>
  );
}
