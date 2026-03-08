"use client";

import { formatTime } from "@/lib/utils";
import type { SessionType, TimerStatus } from "@/lib/types";
import { SESSION_LABELS } from "@/lib/types";

interface TimerDisplayProps {
  timeRemaining: number;
  progress: number;
  sessionType: SessionType;
  status: TimerStatus;
}

/** SVG dimensions and geometry for the progress ring. */
const SIZE = 280;
const STROKE_WIDTH = 8;
const CENTER = SIZE / 2;
const RADIUS = CENTER - STROKE_WIDTH;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Maps session type to a Tailwind stroke color class. */
const RING_COLORS: Record<SessionType, string> = {
  focus: "text-red-500",
  shortBreak: "text-green-500",
  longBreak: "text-blue-500",
};

/**
 * Circular SVG progress ring that shows the remaining time in MM:SS format.
 *
 * The ring fills clockwise as time elapses. The stroke-dashoffset
 * transitions smoothly via CSS for a fluid animation.
 */
export function TimerDisplay({
  timeRemaining,
  progress,
  sessionType,
  status,
}: TimerDisplayProps) {
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const displayTime = formatTime(timeRemaining);

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="rotate-[-90deg]"
        role="img"
        aria-label={`${SESSION_LABELS[sessionType]} timer: ${displayTime} remaining`}
      >
        {/* Background circle (track) */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE_WIDTH}
          className="stroke-zinc-200 dark:stroke-zinc-800"
        />
        {/* Progress circle (foreground) */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          className={`${RING_COLORS[sessionType]} stroke-current transition-[stroke-dashoffset] duration-1000 ease-linear`}
        />
      </svg>

      {/* Time display centered over the SVG */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-5xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50"
          aria-hidden="true"
        >
          {displayTime}
        </span>
        <span className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {SESSION_LABELS[sessionType]}
        </span>
      </div>

      {/* Accessible live region for screen readers */}
      <div aria-live="polite" className="sr-only">
        {status === "running" && `${SESSION_LABELS[sessionType]} timer running: ${displayTime}`}
        {status === "paused" && `${SESSION_LABELS[sessionType]} timer paused at ${displayTime}`}
        {status === "idle" && `${SESSION_LABELS[sessionType]} timer ready: ${displayTime}`}
      </div>
    </div>
  );
}
