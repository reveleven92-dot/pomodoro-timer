/**
 * Formats seconds into MM:SS display string.
 * Example: 125 → "02:05"
 */
export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Returns a human-readable relative time string.
 * Example: "2 min ago", "1 hr ago", "3 days ago"
 */
export function getRelativeTime(isoDateString: string): string {
  const now = Date.now();
  const then = new Date(isoDateString).getTime();
  const diffSeconds = Math.floor((now - then) / 1000);

  if (diffSeconds < 60) return "just now";

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

/**
 * Checks whether an ISO date string falls on today's date.
 */
export function isToday(isoDateString: string): boolean {
  const date = new Date(isoDateString);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * Joins class names, filtering out falsy values.
 * A lightweight replacement for the `clsx` utility.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
