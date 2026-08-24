"use client";

import { useState, useRef, useEffect } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-bg-card border-b border-neutral-200 dark:border-neutral-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 transition-colors h-16">
      <div className="flex items-center gap-2">
        <span className="text-2xl">📊</span>
        <span className="font-bold text-lg hidden sm:block tracking-tight">
          Cryptocrap
        </span>
      </div>

      <div className="hidden md:block w-72">
        {/* ToDo: move out in separate component */}
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-background border border-neutral-300 dark:border-neutral-800 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* ToDo: move out in separate component */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 bg-background border border-neutral-300 dark:border-neutral-800 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
        >
          <span>👤</span>
          <span className="hidden md:block">Profile</span>
          <span
            className="text-xs text-neutral-400 transition-transform duration-200"
            style={{
              transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </button>

        {/* ToDo: move out in separate component */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-2 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-2 text-xs font-semibold text-neutral-400 tracking-wider uppercase">
              Account
            </div>
            <button className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 w-full text-left transition-colors cursor-pointer">
              🔑 <span>Login / Signup</span>
            </button>

            <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-1" />

            <div className="px-3 py-2 text-xs font-semibold text-neutral-400 tracking-wider uppercase">
              Settings
            </div>

            <div className="flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
              <span className="flex items-center gap-3">
                💵 <span>Currency</span>
              </span>
              <select className="bg-background border border-neutral-300 dark:border-neutral-800 text-xs rounded px-1.5 py-0.5 focus:outline-none">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="RUB">RUB (₽)</option>
              </select>
            </div>

            <div className="flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
              <span className="flex items-center gap-3">
                🌐 <span>Language</span>
              </span>
              <select className="bg-background border border-neutral-300 dark:border-neutral-800 text-xs rounded px-1.5 py-0.5 focus:outline-none">
                <option value="RU">Русский</option>
                <option value="EN">English</option>
              </select>
            </div>

            <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-1" />

            <div className="px-3 py-1.5 text-xs text-neutral-400 italic">
              Theme changing
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
