# Project Learnings

## Things We Know to Be True

- [2026-03-08] `useLocalStorage` hook works best with lazy `useState` initialization (`useState(() => readFromStorage())`) rather than calling `setState` inside a `useEffect`. The Next.js ESLint config (`react-hooks/set-state-in-effect`) flags `setState` inside effects as an error.
- [2026-03-08] Assigning to `ref.current` during render (e.g., `onCompleteRef.current = callback`) triggers the `react-hooks/refs` lint error. Use a `useEffect` to sync the ref instead.
- [2026-03-08] `useSyncExternalStore` requires cached/memoized `getSnapshot` return values. Returning parsed JSON (new objects each time) causes infinite re-render loops.
- [2026-03-08] Timer auto-transition (session completion → next session) must NOT clear the `setInterval` if the timer status stays "running". The status-dependent effect that manages the interval won't re-run if status doesn't change, leaving the interval dead.
- [2026-03-08] `jest.advanceTimersByTime(N)` fires all pending interval callbacks synchronously, so React batches all state updates. Effects only run after all callbacks finish.
- [2026-03-08] Tailwind CSS v4 uses `@import "tailwindcss"` and `@theme inline {}` blocks instead of `@tailwind` directives and `tailwind.config.js`.

## Things We Know to Be False

- [2026-03-08] `useSyncExternalStore` is NOT suitable for localStorage reads that return objects — the snapshot is never referentially stable, causing infinite loops.
- [2026-03-08] `setupFilesAfterSetup` is NOT a valid Jest config key — it must be `setupFilesAfterEnv`.

## Edge Cases to Watch For

- [2026-03-08] When testing stats/counts that appear in multiple UI elements (e.g., sessions=2 and streak=2 both show "2"), use `getAllByText` instead of `getByText`.
- [2026-03-08] `getRelativeTime()` depends on `Date.now()` — time-sensitive tests should use fixed dates or `jest.useFakeTimers()`.
- [2026-03-08] The timer interval keeps running during auto-transitions. The `TICK` reducer guards against negative `timeRemaining` with `if (state.timeRemaining <= 0) return state`.

## Architecture Decisions

- [2026-03-08] **shadcn/ui components built manually** — Button, Card, Badge components created from scratch with Tailwind classes following shadcn/ui patterns. No Radix UI primitives used (project rule).
- [2026-03-08] **useReducer for timer state** — The timer uses `useReducer` for complex state transitions (start/pause/reset/tick/complete/switch). The `useRef` holds the interval ID, and two `useEffect` hooks manage the interval lifecycle (one for status changes, one for completion detection).
- [2026-03-08] **Settings panel as a drawer** — Uses CSS transform (`translate-x`) instead of a portal or Radix Dialog. Keeps things simple with no external dependencies.
- [2026-03-08] **Web Audio API for beep** — Uses `AudioContext` with a sine oscillator at 440Hz for 200ms. Lazy-initializes the context on first use. Resumes suspended contexts (browsers block autoplay until user interaction).
- [2026-03-08] **Session history in localStorage** — Stored as an array of `{ type, duration, completedAt }` objects. Last 10 shown in the UI. Stats derived from the full array, filtered by today's date.
- [2026-03-08] **Responsive layout** — Uses Tailwind's `xl:grid-cols-[1fr_320px]` for the desktop sidebar layout. Mobile is stacked single column by default.
