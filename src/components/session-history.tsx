"use client";

import { Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SessionRecord } from "@/lib/types";
import { SESSION_LABELS } from "@/lib/types";
import { getRelativeTime } from "@/lib/utils";

interface SessionHistoryProps {
  sessions: SessionRecord[];
}

/** Badge color for each session type. */
const TYPE_BADGE_COLORS: Record<string, string> = {
  focus: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  shortBreak: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  longBreak: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

/**
 * Displays the last 10 completed sessions in a compact list.
 * Each entry shows the session type, duration, and relative time.
 */
export function SessionHistory({ sessions }: SessionHistoryProps) {
  const recent = sessions.slice(-10).reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No sessions completed yet. Start a focus session!
          </p>
        ) : (
          <ul className="space-y-2" aria-label="Session history">
            {recent.map((session, index) => (
              <li
                key={`${session.completedAt}-${index}`}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={TYPE_BADGE_COLORS[session.type]}
                  >
                    {SESSION_LABELS[session.type]}
                  </Badge>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {session.duration} min
                  </span>
                </div>
                <time
                  dateTime={session.completedAt}
                  className="text-xs text-zinc-400 dark:text-zinc-500"
                >
                  {getRelativeTime(session.completedAt)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
