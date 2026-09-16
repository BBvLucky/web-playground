# Stack

- **Framework**: Next.js 16.2.12 (App Router)
- **Language**: TypeScript 5+
- **React**: 19.2.4
- **Styling**: Tailwind CSS v4
- **Database/Backend**: Supabase (@supabase/ssr, @supabase/supabase-js)
- **Linting**: ESLint 9 + eslint-config-next (core-web-vitals + typescript)

## Commands

```bash
# Development server
npm run dev

# Production build
# npm run build

# Start production server
# npm run start

# Run linter
# npm run lint
```

## Conventions

### Project Structure

- `src/app/` — Next.js App Router pages и layout
- `src/components/` — Reusable UI компоненты (Dropdown, Header, Sidebar, Input, TokenCard)
- `src/hooks/` — Custom React hooks
- `src/types/` — TypeScript типы
- `src/lib/` — Утилитарные функции и библиотеки
- `src/providers/` — React Context providers
- `src/consts/` — Константы проекта
- `src/utils/` — Вспомогательные утилиты

### File Naming

- Компоненты: PascalCase (e.g., `Header.tsx`, `TokenCard.tsx`)
- Типы: PascalCase с суффиксом `.ts` или внутри интерфейсов
- Утилиты: camelCase

### Code Rules

- Server Components by default; `"use client"` только когда необходимо (state, effects, browser APIs)
- Один компонент — один файл; логика >50 строк выносится в хук `src/hooks/use*.ts`
- Типы и интерфейсы — в `src/types/`, не инлайнятся в компоненты
- Импорт через алиас `@/` (проверь paths в tsconfig), не относительный
<!-- TODO подумать над последней строкой -->
- Глобальный стейт-менеджер запрещён; useState/hooks + Context для локальных фич

### Auth Flow

- Аутентификация через Supabase в папке `src/app/(auth)/`
- Разделение на `login/` и `registration/` routes

## Off limits

- Не модифицировать файлы в `.next/`, `out/`, `build/`, `.env*`
- Не удалять `node_modules` вручную (использовать npm/yarn)
- Не менять `next.config.*` без понимания impact'а на сборку
- Не нарушать структуру папок `src/app/(auth)/`
- Не редактировать применённые миграции в `supabase/migrations/`; новые — только через CLI
- Не коммитить ручные правки `package-lock.json`

## Definition of Done

1. **Code Quality**:
   - Все файлы проходят `npm run lint` без ошибок и предупреждений
   - TypeScript компилируется без ошибок (`tsconfig.json`)

2. **Functionality**:
   - Приложения работает в dev режиме: `npm run dev`
   - Сборка проходит успешно: `npm run build`
   - Production сервер стартует: `npm run start`

3. **Documentation**:
   - README.md обновлён при необходимости
   - AGENTS.md актуален и содержит все секции

4. **Testing** :
   - Test suite отсутствует; при добавлении использовать Vitest
