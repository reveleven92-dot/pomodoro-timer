"use client";

import { BarChart3, Target, Flame } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { SessionRecord } from "@/lib/types";
import { isToday } from "@/lib/utils";

interface StatsCardProps {
  sessions: SessionRecord[];
}

/**
 * Displays daily statistics:
 * - Total focus sessions today
 * - Total focus minutes today
 * - Current streak (consecutive focus sessions without skipping)
 *
 * "Streak" counts consecutive focus sessions from the most recent backwards,
 * ignoring breaks (since breaks naturally follow focus sessions).
 * The streak resets if a focus session is skipped (manual switch away).
 */
export function StatsCard({ sessions }: StatsCardProps) {
  const todaySessions = sessions.filter(
    (s) => s.type === "focus" && isToday(s.completedAt),
  );

  const totalFocusSessions = todaySessions.length;
  const totalFocusMinutes = todaySessions.reduce(
    (sum, s) => sum + s.duration,
    0,
  );

  // Count current streak: consecutive focus sessions from the end
  const currentStreak = calculateStreak(sessions);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Today&apos;s Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <StatItem
            icon={<Target className="h-4 w-4 text-red-500" />}
            label="Sessions"
            value={totalFocusSessions}
          />
          <StatItem
            icon={<BarChart3 className="h-4 w-4 text-blue-500" />}
            label="Minutes"
            value={totalFocusMinutes}
          />
          <StatItem
            icon={<Flame className="h-4 w-4 text-orange-500" />}
            label="Streak"
            value={currentStreak}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      {icon}
      <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        {value}
      </span>
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
    </div>
  );
}

/**
 * Counts consecutive focus sessions from the most recent backwards.
 * Only counts focus sessions — breaks are ignored since they're automatic.
 */
function calculateStreak(sessions: SessionRecord[]): number {
  let streak = 0;
  for (let i = sessions.length - 1; i >= 0; i--) {
    const session = sessions[i];
    if (session.type === "focus") {
      streak++;
    } else if (session.type === "shortBreak" || session.type === "longBreak") {
      // Breaks are expected between focus sessions — skip them
      continue;
    }
  }
  return streak;
}
