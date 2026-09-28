export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
}

const STORAGE_KEY = "web-playground-theme";

const SERVER_SNAPSHOT: ThemeState = { theme: "system", resolvedTheme: "light" };

const listeners = new Set<() => void>();

function systemResolved(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readStored(): Theme {
  if (typeof window === "undefined") return "system";
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "light" || v === "dark" || v === "system" ? v : "system";
}

// Client-only init: runs once when the bundle loads, before any render.
let state: ThemeState = (() => {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  const theme = readStored();
  const resolvedTheme = theme === "system" ? systemResolved() : theme;
  document.documentElement.setAttribute("data-theme", resolvedTheme);
  return { theme, resolvedTheme };
})();

function emitChange() {
  listeners.forEach((l) => l());
}

// Live OS preference changes — only matter while in "system" mode.
// Guarded: Next.js can evaluate this module on the server at build time.
if (typeof window !== "undefined") {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (state.theme !== "system") return;
      state = { ...state, resolvedTheme: e.matches ? "dark" : "light" };
      document.documentElement.setAttribute("data-theme", state.resolvedTheme);
      emitChange();
    });
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): ThemeState {
  return state;
}

export function getServerSnapshot(): ThemeState {
  return SERVER_SNAPSHOT;
}

export function setTheme(theme: Theme) {
  const resolvedTheme = theme === "system" ? systemResolved() : theme;
  state = { theme, resolvedTheme };
  localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.setAttribute("data-theme", resolvedTheme);
  emitChange();
}
