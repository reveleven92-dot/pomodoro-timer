"use client";

import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimerStatus } from "@/lib/types";

interface TimerControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

/**
 * Timer control buttons: Start, Pause, and Reset.
 *
 * - Start is shown when idle or paused.
 * - Pause is shown when running.
 * - Reset is always shown but disabled when idle.
 */
export function TimerControls({
  status,
  onStart,
  onPause,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4" role="group" aria-label="Timer controls">
      {status === "running" ? (
        <Button
          onClick={onPause}
          variant="outline"
          size="lg"
          aria-label="Pause timer"
          className="min-w-[120px]"
        >
          <Pause className="mr-2 h-4 w-4" />
          Pause
        </Button>
      ) : (
        <Button
          onClick={onStart}
          size="lg"
          aria-label="Start timer"
          className="min-w-[120px]"
        >
          <Play className="mr-2 h-4 w-4" />
          {status === "paused" ? "Resume" : "Start"}
        </Button>
      )}

      <Button
        onClick={onReset}
        variant="outline"
        size="lg"
        disabled={status === "idle"}
        aria-label="Reset timer"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
