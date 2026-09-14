"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useGetUserProvider } from "@/providers/useGetUserProvider";

import DropdownItem from "./DropdownItem";
import DropdownDivider from "./DropdownDivider";
import DropdownSectionTitle from "./DropdownSectionTitle";
import { createClient } from "@/lib/supabase/client";

function Dropdown() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useGetUserProvider();

  useEffect(() => {
    function onMouseDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleSignOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  }, []);

  const email = user?.email;

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-background border border-neutral-300 dark:border-neutral-800 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
      >
        <span>👤</span>
        <span className="hidden md:block max-w-40 truncate">
          {email ?? "Profile"}
        </span>
        <span
          className="text-xs text-neutral-400 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-2 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <DropdownSectionTitle>Account</DropdownSectionTitle>
          {loading ? (
            <div className="px-3 py-2 text-sm text-neutral-400 italic">…</div>
          ) : user ? (
            <DropdownItem icon="🚪" title="Sign out" onClick={handleSignOut} />
          ) : (
            <DropdownItem
              icon="🔑"
              title="Login / Signup"
              href="/registration"
            />
          )}

          <DropdownDivider />

          <DropdownSectionTitle>Settings</DropdownSectionTitle>
          <DropdownItem icon="💵" title="Currency">
            {/* заглушка */}
            <select className="bg-background border border-neutral-300 dark:border-neutral-800 text-xs rounded px-1.5 py-0.5 focus:outline-none">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="RUB">RUB (₽)</option>
            </select>
          </DropdownItem>
          <DropdownItem icon="🌐" title="Language">
            {/* заглушка */}
            <select className="bg-background border border-neutral-300 dark:border-neutral-800 text-xs rounded px-1.5 py-0.5 focus:outline-none">
              <option value="RU">Русский</option>
              <option value="EN">English</option>
            </select>
          </DropdownItem>

          <DropdownDivider />

          {/* заглушка: смена темы */}
          <div className="px-3 py-1.5 text-xs text-neutral-400 italic">
            Theme changing
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
