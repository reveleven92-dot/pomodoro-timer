# pomodoro-timer — Project Specification

## Tech Stack
- Language: typescript
- Framework: nextjs
- Stack: Next.js + TypeScript + Tailwind CSS v4 + App Router

## Conventions
- Linter: `npx eslint .`
- Formatter: `npx prettier --write .`
- Tests: `npx jest --passWithNoTests`
- Max file lines: 800
- Max function lines: 80
- Min test coverage: 80%

## Architecture

Single-page Next.js application (App Router) with no backend. All state lives in the browser:

- **Timer logic** — `useReducer` inside the `useTimer` hook drives state transitions (idle → running → paused → complete). A `setInterval` (managed by `useEffect`) ticks every second. Completion triggers auto-transition to the next session type without stopping the interval.
- **Persistence** — A `useLocalStorage` hook wraps `localStorage`. Settings and session history survive page refreshes. Lazy `useState` initialization avoids ESLint `react-hooks/set-state-in-effect` violations.
- **Audio** — Web Audio API generates a 440 Hz sine-wave beep (200 ms) on session completion. No audio files bundled. The `AudioContext` is lazy-initialized and resumes suspended contexts (browser autoplay policy).
- **Notifications** — `sonner` toasts appear at the top-center on every session transition.
- **Layout** — CSS Grid with `xl:grid-cols-[1fr_320px]`. Mobile: single-column stack. Desktop: timer centered, history + stats in a 320 px sidebar.

## Key Modules

| Path | Responsibility |
|------|---------------|
| `src/lib/types.ts` | Shared types (`SessionType`, `TimerStatus`, `TimerSettings`, `SessionRecord`, `DailyStats`) and constants (`DEFAULT_SETTINGS`, `SESSION_LABELS`, `SESSION_COLORS`, `LONG_BREAK_INTERVAL`). |
| `src/lib/utils.ts` | Pure helpers: `formatTime(seconds)`, `getRelativeTime(iso)`, `computeDailyStats(sessions[])`. |
| `src/hooks/use-timer.ts` | Core timer: `useReducer` + `setInterval` + auto-transition logic. Exposes `start`, `pause`, `reset`, `switchSession`, `progress`. |
| `src/hooks/use-local-storage.ts` | Generic `useLocalStorage<T>(key, defaultValue)` hook with lazy init and JSON serialization. |
| `src/hooks/use-audio.ts` | `useAudio()` — returns `playBeep()` backed by the Web Audio API. |
| `src/hooks/use-keyboard-shortcuts.ts` | Binds `Space` (toggle), `R` (reset), `1`/`2`/`3` (switch session) via `keydown` listener. |
| `src/components/timer-display.tsx` | SVG circular progress ring + `MM:SS` countdown. Colour-coded by session type. |
| `src/components/timer-controls.tsx` | Start / Pause / Reset buttons. Disabled states driven by `TimerStatus`. |
| `src/components/session-tabs.tsx` | Tab bar for switching between Focus / Short Break / Long Break. |
| `src/components/settings-panel.tsx` | Slide-in drawer (CSS transform) for configuring per-session durations (1–90 min). |
| `src/components/session-history.tsx` | Last 10 completed sessions with type, duration, and relative time. |
| `src/components/stats-card.tsx` | Daily totals: focus sessions, focus minutes, current streak. |
| `src/components/shortcuts-help.tsx` | `?` icon with a hover tooltip listing all keyboard shortcuts. |
| `src/components/ui/` | Manual shadcn/ui-style primitives: `Button`, `Card`, `Badge`. No Radix UI. |
| `src/app/page.tsx` | Root page — wires all hooks and components into the responsive layout. |
