import type { HTMLAttributes } from "react";

import { cn } from "../lib/utils";

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

export function Progress({
  value = 0,
  max = 100,
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-[#2a2520]",
        className,
      )}
      {...props}
    >
      <div
        className="h-full rounded-full bg-[#c9a84c] transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
