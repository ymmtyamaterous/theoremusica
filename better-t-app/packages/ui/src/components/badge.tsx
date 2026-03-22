import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        beginner:
          "bg-[#4a6741]/20 text-[#4a6741] dark:bg-[#4a6741]/30 dark:text-[#7ab06f]",
        intermediate:
          "bg-[#c9a84c]/20 text-[#c9a84c] dark:bg-[#c9a84c]/30 dark:text-[#e8cc87]",
        advanced:
          "bg-[#8b3a2a]/20 text-[#8b3a2a] dark:bg-[#8b3a2a]/30 dark:text-[#d47a6a]",
        outline: "border border-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
