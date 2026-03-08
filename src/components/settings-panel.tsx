"use client";

import { useState } from "react";
import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimerSettings } from "@/lib/types";
import { MIN_DURATION, MAX_DURATION } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SettingsPanelProps {
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
}

interface DurationFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  id: string;
}

/**
 * A single duration input field with validation.
 */
function DurationField({ label, value, onChange, id }: DurationFieldProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label htmlFor={id} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          min={MIN_DURATION}
          max={MAX_DURATION}
          value={value}
          onChange={(e) => {
            const raw = parseInt(e.target.value, 10);
            if (isNaN(raw)) return;
            const clamped = Math.min(MAX_DURATION, Math.max(MIN_DURATION, raw));
            onChange(clamped);
          }}
          className={cn(
            "w-20 rounded-md border border-zinc-200 bg-white px-3 py-2 text-center text-sm",
            "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
            "focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2",
          )}
          aria-label={`${label} in minutes`}
        />
        <span className="text-sm text-zinc-500">min</span>
      </div>
    </div>
  );
}

/**
 * A slide-out settings panel triggered by a gear icon.
 * Lets users customize durations for Focus, Short Break, and Long Break.
 * Durations are clamped between MIN_DURATION and MAX_DURATION.
 */
export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateField = (field: keyof TimerSettings, value: number) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  return (
    <>
      {/* Gear icon button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        aria-label="Open settings"
        className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <Settings className="h-5 w-5" />
      </Button>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Settings drawer */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-sm transform bg-white shadow-xl transition-transform duration-300",
          "dark:bg-zinc-950 dark:border-l dark:border-zinc-800",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-label="Timer settings"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Settings
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            aria-label="Close settings"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6 p-6">
          <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Session Durations
          </h3>

          <div className="space-y-4">
            <DurationField
              label="Focus"
              value={settings.focusDuration}
              onChange={(v) => updateField("focusDuration", v)}
              id="settings-focus"
            />
            <DurationField
              label="Short Break"
              value={settings.shortBreakDuration}
              onChange={(v) => updateField("shortBreakDuration", v)}
              id="settings-short-break"
            />
            <DurationField
              label="Long Break"
              value={settings.longBreakDuration}
              onChange={(v) => updateField("longBreakDuration", v)}
              id="settings-long-break"
            />
          </div>

          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Durations must be between {MIN_DURATION} and {MAX_DURATION} minutes.
            Changes apply when you start the next session.
          </p>
        </div>
      </aside>
    </>
  );
}
