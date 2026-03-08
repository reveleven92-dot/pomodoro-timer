/** The three kinds of Pomodoro session. */
export type SessionType = "focus" | "shortBreak" | "longBreak";

/** Possible states for the countdown timer. */
export type TimerStatus = "idle" | "running" | "paused";

/** User-configurable durations (in minutes) for each session type. */
export interface TimerSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
}

/** A single completed session stored in history. */
export interface SessionRecord {
  type: SessionType;
  /** Duration in minutes. */
  duration: number;
  /** ISO-8601 timestamp of when the session completed. */
  completedAt: string;
}

/** Daily statistics derived from session history. */
export interface DailyStats {
  totalFocusSessions: number;
  totalFocusMinutes: number;
  currentStreak: number;
}

/** Default durations for each session type (in minutes). */
export const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
};

/** Human-readable labels for each session type. */
export const SESSION_LABELS: Record<SessionType, string> = {
  focus: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

/** Colors associated with each session type for the progress ring. */
export const SESSION_COLORS: Record<SessionType, string> = {
  focus: "stroke-red-500",
  shortBreak: "stroke-green-500",
  longBreak: "stroke-blue-500",
};

/**
 * Number of focus sessions before triggering a long break.
 * After every 4th focus session, a long break starts.
 */
export const LONG_BREAK_INTERVAL = 4;

/** Minimum allowed duration in minutes for any session type. */
export const MIN_DURATION = 1;

/** Maximum allowed duration in minutes for any session type. */
export const MAX_DURATION = 90;
