"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "next-i18next/client";

import { useGetUserProvider } from "@/providers/useGetUserProvider";
import { createClient } from "@/lib/supabase/client";

import DropdownItem from "./DropdownItem";
import DropdownDivider from "./DropdownDivider";
import DropdownSectionTitle from "./DropdownSectionTitle";
import ThemeToggler from "./ThemeToggler";
import DropdownLangSwitcher from "./DropdownLangSwitcher";

function Dropdown() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useGetUserProvider();
  const { t } = useT("common");

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
          {email ?? t("dropdown.profile")}
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
          <DropdownSectionTitle>{t("dropdown.account")}</DropdownSectionTitle>
          {loading ? (
            <div className="px-3 py-2 text-sm text-neutral-400 italic">…</div>
          ) : user ? (
            <DropdownItem
              icon="🚪"
              title={t("authorization.signOut")}
              onClick={handleSignOut}
            />
          ) : (
            <DropdownItem
              icon="🔑"
              title={`${t("authorization.signIn")} / ${t("authorization.signUp")}`}
              href="/registration"
            />
          )}

          <DropdownDivider />

          <DropdownSectionTitle>{t("dropdown.settings")}</DropdownSectionTitle>
          <DropdownItem icon="💵" title={t("dropdown.currency")}>
            {/* заглушка */}
            <select className="bg-background border border-neutral-300 dark:border-neutral-800 text-xs rounded px-1.5 py-0.5 focus:outline-none">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="RUB">RUB (₽)</option>
            </select>
          </DropdownItem>
          <DropdownItem
            icon="🌐"
            title={t("dropdown.language")}
            labelFor="switchLang"
          >
            <DropdownLangSwitcher />
          </DropdownItem>

          <DropdownDivider />

          <DropdownSectionTitle>
            {t("dropdown.appearance")}
          </DropdownSectionTitle>
          <ThemeToggler />
        </div>
      )}
    </div>
  );
}

export default Dropdown;
