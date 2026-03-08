"use client";

import { useCallback } from "react";
import { Toaster, toast } from "sonner";
import { TimerDisplay } from "@/components/timer-display";
import { TimerControls } from "@/components/timer-controls";
import { SessionTabs } from "@/components/session-tabs";
import { SettingsPanel } from "@/components/settings-panel";
import { SessionHistory } from "@/components/session-history";
import { StatsCard } from "@/components/stats-card";
import { ShortcutsHelp } from "@/components/shortcuts-help";
import { useTimer } from "@/hooks/use-timer";
import { useAudio } from "@/hooks/use-audio";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import type { SessionType, TimerSettings, SessionRecord } from "@/lib/types";
import { DEFAULT_SETTINGS, SESSION_LABELS } from "@/lib/types";

/**
 * Main Pomodoro Timer page.
 *
 * Assembles all components into a responsive layout:
 * - Mobile: stacked, single column
 * - Desktop: timer centered with sidebar for history and stats
 */
export default function PomodoroPage() {
  const [settings, setSettings] = useLocalStorage<TimerSettings>(
    "pomodoro-settings",
    DEFAULT_SETTINGS,
  );
  const [sessions, setSessions] = useLocalStorage<SessionRecord[]>(
    "pomodoro-sessions",
    [],
  );

  const { playBeep } = useAudio();

  const handleSessionComplete = useCallback(
    (completedType: SessionType, nextType: SessionType) => {
      // Record the completed session
      const record: SessionRecord = {
        type: completedType,
        duration: getDurationForType(completedType, settings),
        completedAt: new Date().toISOString(),
      };
      setSessions((prev) => [...prev, record]);

      // Play audio beep
      playBeep();

      // Show toast notification
      toast.success(
        `${SESSION_LABELS[completedType]} complete! Starting ${SESSION_LABELS[nextType]}.`,
        { duration: 4000 },
      );
    },
    [playBeep, setSessions, settings],
  );

  const timer = useTimer({ settings, onSessionComplete: handleSessionComplete });

  useKeyboardShortcuts({
    status: timer.status,
    start: timer.start,
    pause: timer.pause,
    reset: timer.reset,
    switchSession: timer.switchSession,
  });

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Pomodoro Timer
          </h1>
          <div className="flex items-center gap-1">
            <ShortcutsHelp />
            <SettingsPanel settings={settings} onSettingsChange={setSettings} />
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
            {/* Timer column */}
            <section className="flex flex-col items-center gap-8">
              <SessionTabs
                activeType={timer.sessionType}
                onSwitch={timer.switchSession}
              />

              <TimerDisplay
                timeRemaining={timer.timeRemaining}
                progress={timer.progress}
                sessionType={timer.sessionType}
                status={timer.status}
              />

              <TimerControls
                status={timer.status}
                onStart={timer.start}
                onPause={timer.pause}
                onReset={timer.reset}
              />
            </section>

            {/* Sidebar: history and stats */}
            <aside className="flex flex-col gap-6">
              <StatsCard sessions={sessions} />
              <SessionHistory sessions={sessions} />
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}

/** Helper to get the configured duration (in minutes) for a session type. */
function getDurationForType(
  type: SessionType,
  settings: TimerSettings,
): number {
  switch (type) {
    case "focus":
      return settings.focusDuration;
    case "shortBreak":
      return settings.shortBreakDuration;
    case "longBreak":
      return settings.longBreakDuration;
  }
}
