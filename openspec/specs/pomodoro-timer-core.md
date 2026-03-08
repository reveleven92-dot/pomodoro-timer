# Spec: Pomodoro Timer — Core UI and Session Tracking

**Issue:** #1
**PR:** #2
**Status:** Implemented (2026-03-08)

---

## Overview

A single-page Pomodoro timer web app. No authentication, no backend, no multi-device sync. All state lives in `localStorage`.

---

## Session Types

| Type | Default Duration | Key shortcut |
|------|-----------------|--------------|
| Focus | 25 min | `1` |
| Short Break | 5 min | `2` |
| Long Break | 15 min | `3` |

Durations are configurable via the Settings panel (min 1 min, max 90 min).

---

## Auto-Transition Rules

- Focus → Short Break (after sessions 1, 2, 3)
- Focus → Long Break (after every 4th focus session; `LONG_BREAK_INTERVAL = 4`)
- Any Break → Focus

On each transition:
1. Play a 440 Hz sine-wave beep (200 ms, Web Audio API).
2. Show a `sonner` toast at the top-center for 4 seconds.
3. Start the next session automatically (timer stays running).

---

## Timer States

```
idle ──Start──► running ──Pause──► paused
 ▲                │                  │
 └────Reset───────┘◄────────Resume───┘
                  │
           (timeRemaining = 0)
                  │
           SESSION_COMPLETE (auto)
                  │
             new session, running
```

---

## Data Model

### `TimerSettings` (localStorage key: `pomodoro-settings`)

```ts
{
  focusDuration: number;       // minutes, default 25
  shortBreakDuration: number;  // minutes, default 5
  longBreakDuration: number;   // minutes, default 15
}
```

### `SessionRecord[]` (localStorage key: `pomodoro-sessions`)

```ts
{
  type: "focus" | "shortBreak" | "longBreak";
  duration: number;      // minutes
  completedAt: string;   // ISO-8601
}
```

---

## Acceptance Criteria

| # | Criterion | Status |
|---|-----------|--------|
| AC1 | SVG circular progress ring with `MM:SS` countdown, colour-coded by session type | ✅ |
| AC2 | Start / Pause / Reset controls; buttons disable appropriately | ✅ |
| AC3 | Tab-style session switcher; switching resets timer | ✅ |
| AC4 | Auto-transition with toast + beep on completion | ✅ |
| AC5 | Settings panel (gear icon drawer) with duration inputs, persisted to localStorage | ✅ |
| AC6 | Last 10 sessions listed with type, duration, relative time | ✅ |
| AC7 | Stats card: focus sessions today, focus minutes today, current streak | ✅ |
| AC8 | Responsive: mobile (375 px), tablet (768 px), desktop (1280 px) | ✅ |
| AC9 | Keyboard shortcuts: Space (toggle), R (reset), 1/2/3 (switch), `?` help tooltip | ✅ |
| AC10 | WCAG AA: visible focus rings, aria-labels, aria-live region for timer status | ✅ |

---

## Component Map

```
PomodoroPage (src/app/page.tsx)
├── ShortcutsHelp
├── SettingsPanel
├── SessionTabs
├── TimerDisplay          ← SVG ring + countdown
├── TimerControls         ← Start / Pause / Reset
├── StatsCard
└── SessionHistory
```

---

## Hooks

| Hook | Purpose |
|------|---------|
| `useTimer` | Core timer state machine (`useReducer` + `setInterval`) |
| `useLocalStorage` | Generic localStorage read/write with lazy init |
| `useAudio` | Web Audio API beep generator |
| `useKeyboardShortcuts` | Global `keydown` listener for Space / R / 1 / 2 / 3 |

---

## Test Coverage

Tests live in `src/__tests__/`. Key files:

| File | What it covers |
|------|---------------|
| `use-timer.test.ts` | State transitions, auto-transition, long-break interval, tick guards |
| `use-local-storage.test.ts` | Read/write, default value, JSON round-trip |
| `utils.test.ts` | `formatTime`, `getRelativeTime`, `computeDailyStats` |
| `types.test.ts` | Constants and default values |
| `components.test.tsx` | TimerDisplay, TimerControls, SessionTabs, StatsCard, SessionHistory rendering |

Minimum coverage requirement: **80% lines**.

---

## Known Gotchas

- Do not clear the `setInterval` in the completion effect — the status stays `"running"` across the transition, so the status-effect won't fire again to create a new interval.
- `useLocalStorage` must use lazy `useState` initialization to avoid ESLint `react-hooks/set-state-in-effect` violations.
- The `TICK` reducer must guard `if (state.timeRemaining <= 0) return state` to prevent double-ticking below zero during async batching.
