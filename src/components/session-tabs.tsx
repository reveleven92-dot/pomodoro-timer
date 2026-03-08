"use client";

import { Button } from "@/components/ui/button";
import type { SessionType } from "@/lib/types";
import { SESSION_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SessionTabsProps {
  activeType: SessionType;
  onSwitch: (type: SessionType) => void;
}

const SESSION_TYPES: SessionType[] = ["focus", "shortBreak", "longBreak"];

/**
 * Tab-style buttons for switching between Focus, Short Break, and Long Break.
 * Switching resets the timer to the new session's configured duration.
 */
export function SessionTabs({ activeType, onSwitch }: SessionTabsProps) {
  return (
    <nav
      className="flex items-center justify-center gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800"
      role="tablist"
      aria-label="Session type"
    >
      {SESSION_TYPES.map((type) => (
        <Button
          key={type}
          role="tab"
          aria-selected={activeType === type}
          variant="ghost"
          size="sm"
          onClick={() => onSwitch(type)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            activeType === type
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50",
          )}
        >
          {SESSION_LABELS[type]}
        </Button>
      ))}
    </nav>
  );
}
