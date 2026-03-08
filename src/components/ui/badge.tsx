import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900",
  secondary:
    "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
  outline:
    "border border-zinc-200 text-zinc-900 dark:border-zinc-700 dark:text-zinc-100",
};

/**
 * A badge/tag component following shadcn/ui conventions.
 */
function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Badge, type BadgeProps };
