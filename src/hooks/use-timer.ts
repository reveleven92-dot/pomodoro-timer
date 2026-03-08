"use client";

import { useReducer, useRef, useCallback, useEffect } from "react";
import type { SessionType, TimerSettings, TimerStatus } from "@/lib/types";
import { LONG_BREAK_INTERVAL } from "@/lib/types";

// ─── State ────────────────────────────────────────────────────────────────

interface TimerState {
  status: TimerStatus;
  sessionType: SessionType;
  timeRemaining: number;
  focusCount: number;
}

// ─── Actions ──────────────────────────────────────────────────────────────

type TimerAction =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "TICK" }
  | { type: "RESET"; durationSeconds: number }
  | { type: "SWITCH_SESSION"; sessionType: SessionType; durationSeconds: number }
  | { type: "SESSION_COMPLETE"; nextType: SessionType; durationSeconds: number };

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "START":
      return { ...state, status: "running" };
    case "PAUSE":
      return { ...state, status: "paused" };
    case "TICK":
      if (state.timeRemaining <= 0) return state;
      return { ...state, timeRemaining: state.timeRemaining - 1 };
    case "RESET":
      return { ...state, status: "idle", timeRemaining: action.durationSeconds };
    case "SWITCH_SESSION":
      return {
        ...state,
        status: "idle",
        sessionType: action.sessionType,
        timeRemaining: action.durationSeconds,
      };
    case "SESSION_COMPLETE":
      return {
        ...state,
        status: "running",
        sessionType: action.nextType,
        timeRemaining: action.durationSeconds,
        focusCount:
          state.sessionType === "focus"
            ? state.focusCount + 1
            : state.focusCount,
      };
    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────

interface UseTimerOptions {
  settings: TimerSettings;
  onSessionComplete: (completedType: SessionType, nextType: SessionType) => void;
}

export function useTimer({ settings, onSessionComplete }: UseTimerOptions) {
  const getDurationSeconds = useCallback(
    (type: SessionType): number => {
      switch (type) {
        case "focus":
          return settings.focusDuration * 60;
        case "shortBreak":
          return settings.shortBreakDuration * 60;
        case "longBreak":
          return settings.longBreakDuration * 60;
      }
    },
    [settings],
  );

  const [state, dispatch] = useReducer(timerReducer, {
    status: "idle" as TimerStatus,
    sessionType: "focus" as SessionType,
    timeRemaining: settings.focusDuration * 60,
    focusCount: 0,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onSessionComplete);

  // Keep the callback ref up-to-date without assigning during render
  useEffect(() => {
    onCompleteRef.current = onSessionComplete;
  }, [onSessionComplete]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Manage the interval based on timer status
  useEffect(() => {
    if (state.status === "running") {
      intervalRef.current = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.status]);

  // Detect when timer hits zero — don't clear the existing interval.
  // The interval will keep ticking the new session's timeRemaining after
  // SESSION_COMPLETE resets it. This avoids the problem where status stays
  // "running" but the status-effect doesn't re-fire to create a new interval.
  useEffect(() => {
    if (state.timeRemaining === 0 && state.status === "running") {
      const completedType = state.sessionType;
      const nextType = getNextSessionType(completedType, state.focusCount);
      const nextDuration = getDurationSeconds(nextType);

      onCompleteRef.current(completedType, nextType);
      dispatch({
        type: "SESSION_COMPLETE",
        nextType,
        durationSeconds: nextDuration,
      });
    }
  }, [state.timeRemaining, state.status, state.sessionType, state.focusCount, getDurationSeconds]);

  const start = useCallback(() => dispatch({ type: "START" }), []);
  const pause = useCallback(() => dispatch({ type: "PAUSE" }), []);

  const reset = useCallback(() => {
    dispatch({
      type: "RESET",
      durationSeconds: getDurationSeconds(state.sessionType),
    });
  }, [getDurationSeconds, state.sessionType]);

  const switchSession = useCallback(
    (type: SessionType) => {
      dispatch({
        type: "SWITCH_SESSION",
        sessionType: type,
        durationSeconds: getDurationSeconds(type),
      });
    },
    [getDurationSeconds],
  );

  const totalSeconds = getDurationSeconds(state.sessionType);
  const progress =
    totalSeconds > 0 ? (totalSeconds - state.timeRemaining) / totalSeconds : 0;

  return {
    status: state.status,
    sessionType: state.sessionType,
    timeRemaining: state.timeRemaining,
    focusCount: state.focusCount,
    progress,
    totalSeconds,
    start,
    pause,
    reset,
    switchSession,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────

/**
 * Determines the next session type based on what just completed.
 * - After a focus session: short break (or long break every Nth focus session)
 * - After any break: focus
 */
function getNextSessionType(
  completed: SessionType,
  currentFocusCount: number,
): SessionType {
  if (completed === "focus") {
    // currentFocusCount is pre-increment, so +1 is the count after completion
    const nextCount = currentFocusCount + 1;
    return nextCount % LONG_BREAK_INTERVAL === 0 ? "longBreak" : "shortBreak";
  }
  return "focus";
}
