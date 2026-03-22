import { Badge } from "@better-t-app/ui/components/badge";

type Level = "beginner" | "intermediate" | "advanced";

const levelLabel: Record<Level, string> = {
  beginner: "入門",
  intermediate: "中級",
  advanced: "上級",
};

interface LevelBadgeProps {
  level: Level;
  className?: string;
}

export function LevelBadge({ level, className }: LevelBadgeProps) {
  return (
    <Badge variant={level} className={className}>
      {levelLabel[level]}
    </Badge>
  );
}
