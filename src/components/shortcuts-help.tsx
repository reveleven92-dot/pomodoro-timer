"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SHORTCUTS = [
  { key: "Space", action: "Start / Pause" },
  { key: "R", action: "Reset timer" },
  { key: "1", action: "Focus" },
  { key: "2", action: "Short Break" },
  { key: "3", action: "Long Break" },
];

/**
 * A help icon button that shows a tooltip listing keyboard shortcuts.
 * Tooltip appears on hover (desktop) or click (mobile).
 */
export function ShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Keyboard shortcuts"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      {/* Tooltip */}
      <div
        role="tooltip"
        className={cn(
          "absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg",
          "dark:border-zinc-700 dark:bg-zinc-900",
          "transition-opacity duration-150",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Shortcuts
        </p>
        <ul className="space-y-1">
          {SHORTCUTS.map((shortcut) => (
            <li
              key={shortcut.key}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-zinc-600 dark:text-zinc-300">
                {shortcut.action}
              </span>
              <kbd className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {shortcut.key}
              </kbd>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
