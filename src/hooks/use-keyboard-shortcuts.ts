"use client";

import { useEffect } from "react";
import type { SessionType, TimerStatus } from "@/lib/types";

interface UseKeyboardShortcutsOptions {
  status: TimerStatus;
  start: () => void;
  pause: () => void;
  reset: () => void;
  switchSession: (type: SessionType) => void;
}

/**
 * Registers global keyboard shortcuts for the Pomodoro timer:
 * - Space: toggle start/pause
 * - R: reset timer
 * - 1: switch to Focus
 * - 2: switch to Short Break
 * - 3: switch to Long Break
 *
 * Shortcuts are ignored when the user is typing in an input or textarea.
 */
export function useKeyboardShortcuts({
  status,
  start,
  pause,
  reset,
  switchSession,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Don't intercept when user is typing in a form field
      const tag = (event.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        return;
      }

      switch (event.key) {
        case " ": {
          event.preventDefault();
          if (status === "running") {
            pause();
          } else {
            start();
          }
          break;
        }
        case "r":
        case "R": {
          event.preventDefault();
          reset();
          break;
        }
        case "1": {
          event.preventDefault();
          switchSession("focus");
          break;
        }
        case "2": {
          event.preventDefault();
          switchSession("shortBreak");
          break;
        }
        case "3": {
          event.preventDefault();
          switchSession("longBreak");
          break;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, start, pause, reset, switchSession]);
}
