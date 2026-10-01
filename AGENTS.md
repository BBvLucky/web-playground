# web-playground

Personal playground project: Next.js 16 (App Router) + Supabase auth + i18n (en/ru).

## Stack

| Layer     | Tech                                                                 |
| --------- | -------------------------------------------------------------------- |
| Framework | Next.js 16.2.12 (App Router, Turbopack)                              |
| Language  | TypeScript 5, `strict: true`                                         |
| UI        | React 19.2.4                                                         |
| Styling   | Tailwind CSS v4 (`@tailwindcss/postcss`, CSS-first config)           |
| Auth/DB   | Supabase — `@supabase/ssr` ^0.12.6, `@supabase/supabase-js` ^2.115.0 |
| i18n      | next-i18next ^16.3.1, i18next ^26.4.2, react-i18next ^17.0.15        |
| Linting   | ESLint 9 (flat config) + eslint-config-next                          |

## Commands

```bash
npm install            # install dependencies
npm run dev            # dev server
npm run build          # production build
npm run start          # serve production build
npm run lint           # eslint (whole project)
npx tsc --noEmit       # type-check (no dedicated script)
```

There is no test runner installed. If tests are added, use Vitest.

## Setup

```bash
cp .env.example .env.local
```

Required env vars:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Project Structure

```
src/
├── app/                  # App Router: pages, layouts, route groups
│   ├── (auth)/           # Route group: /login, /registration
│   └── i18n/locales/     # Translation JSON: {en,ru}/{namespace}.json
├── components/           # Reusable UI (Input, ErrorAlert, Dropdown, Header, Sidebar, TokenCard)
├── consts/               # Constants (e.g. MIN_PASSWORD_LENGTH)
├── hooks/                # Custom hooks (useAuth, ...)
├── lib/
│   └── supabase/         # Supabase clients: client.ts (browser), server.ts (server)
├── providers/            # React Context providers
├── types/                # All shared TypeScript types/interfaces
├── utils/
│   └── supabase/         # middleware.ts — updateSession() auth guard
├── proxy.ts              # Request entrypoint (Next 16 "middleware")
├── i18n.config.ts        # next-i18next config
├── layout.tsx
└── page.tsx              # Home
```

## Conventions

### Code Rules

- Server Components by default; `"use client"` only when needed (state, effects, browser APIs).
- One component per file; logic over 50 lines moves to a hook in `src/hooks/use*.ts`.
- Types and interfaces live in `src/types/`, never inlined in components.
- Import via the `@/` alias (`@/*` → `./src/*`), not relative paths.
- No global state manager; useState/custom hooks + Context for local features.
- Declare components as named functions first, then export them separately. Never use `export default function`:

  ```tsx
  // ❌
  export default function TokenCard() { ... }

  // ✅
  function TokenCard() { ... }
  export default TokenCard;

  ```

### File Naming

- Components: PascalCase (`Header.tsx`).
- Hooks: `usePascalCase.ts`.
- Utilities and constants: camelCase.
- Type files: PascalCase (`.ts`).

### Styling

- Tailwind v4 is configured in CSS, not `tailwind.config.js`. Custom design tokens go in `@theme` blocks in `src/app/global.css`. Do not create a `tailwind.config.*` file.

### i18n

- Locales: `en` (fallback), `ru`. `localeInPath: false` — locale is NOT part of the URL; switching happens client-side.
- New user-facing strings go through i18next namespaces; add keys to **both** `src/app/i18n/locales/en/*.json` and `.../ru/*.json`.
- A namespace is a **file**, not a key: the `common` namespace lives in `common.json`, an `auth` namespace would live in `auth.json`.
- Top-level keys inside a file are translation keys of that namespace. Never nest a namespace inside another file:

  ```jsonc
  // ❌ there is no "registration" namespace here — these are just keys of common
  { "login_title": "Login", "registration": { "title": "Register" } }

  // ✅ registration is its own file: src/app/i18n/locales/en/registration.json
  ```

- New user-facing strings go into the common namespace unless a dedicated namespace already exists for that area. Creating a new namespace = adding {name}.json to both en/ and ru/. The resource loader in i18n.config.ts resolves namespaces by filename — there is no registry to update, and a missing file breaks the build for that locale.
- Client components: `useT` from `next-i18next/client`. Server components, layouts, `generateMetadata`: `getT` from `next-i18next/server`. Never swap sides — mixing them breaks hydration.

## Auth Flow

- Pages: `src/app/(auth)/login/page.tsx`, `registration/page.tsx` (client components using `useAuth("login" | "register")`).
- Clients:
  - Browser: `createClient()` from `@/lib/supabase/client` — sync, for client components.
  - Server: `await createClient()` from `@/lib/supabase/server` — async, cookie-based session, for server components/actions.
- Route protection: `updateSession()` in `src/utils/supabase/middleware.ts`, invoked from `src/proxy.ts` after the i18n proxy.
  - Unauthenticated + `/dashboard`, `/profile`, `/portfolio` → redirect to `/login`.
  - Authenticated + `/login`, `/registration` → redirect to `/`.
- To protect a new route, add its path to the `PROTECTED` array in `middleware.ts`. Nothing else is checked.

## Known Traps

- **Next 16 renamed `middleware.ts` to `proxy.ts`.** The request entrypoint is `src/proxy.ts`; it chains `i18nProxy` → `updateSession`. Do not reintroduce a `middleware.ts` or reorder the chain — auth redirects and locale handling depend on it.
- **Two Supabase clients.** Using the server client in a client component (or vice versa) silently drops the session. Pick by execution context, not by convenience.
- **Server client cookie adapter** (`getAll`/`setAll`) is load-bearing for session refresh. Don't replace it with manual `document.cookie` or raw header reads.
- **`experimental.rootParams: true` in `next.config.ts`** is required for `next/root-params` on Next 16.2. Removing it breaks any code reading root-level params.
- **Matcher in `proxy.ts`** excludes static assets (`_next/static`, images, favicon). Extending matched paths to static files adds unnecessary auth work per asset request.

## Off Limits

- Generated artifacts: `.next/`, `out/`, `build/` — regenerate, never edit.
- `.env*` files — never commit, never modify values.
- `package-lock.json` — no manual edits; dependency changes only via npm.
- Applied migrations in `supabase/migrations/` are immutable; new ones only via the Supabase CLI.
- Do not rename or move `src/app/(auth)/`, `src/proxy.ts`, or `src/i18n.config.ts` — the proxy chain and matcher break silently.
- `node_modules` — manage via npm, never delete by hand mid-session.

## Definition of Done

1. `npm run lint` passes with no new errors on changed files (pre-existing warnings outside the diff are acceptable).
2. `npx tsc --noEmit` passes.
3. `npm run build` succeeds and `npm run start` serves the app.
4. README updated if user-visible behavior changed.
