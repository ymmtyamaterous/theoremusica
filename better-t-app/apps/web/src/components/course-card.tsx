import { Badge } from "@better-t-app/ui/components/badge";
import { Link } from "@tanstack/react-router";

type Level = "beginner" | "intermediate" | "advanced";

const levelLabel: Record<Level, string> = {
  beginner: "入門",
  intermediate: "中級",
  advanced: "上級",
};

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  level: Level;
  icon: string;
  lessonCount: number;
  durationHours: number;
}

export function CourseCard({
  id,
  title,
  description,
  level,
  icon,
  lessonCount,
  durationHours,
}: CourseCardProps) {
  return (
    <Link
      to="/courses/$courseId"
      params={{ courseId: String(id) }}
      className="group block rounded-xl border border-[#2a2520] bg-[#13120f] p-6 transition-all duration-200 hover:border-[#c9a84c]/40 hover:bg-[#1a1714]"
    >
      <div className="mb-4 flex items-start justify-between">
        <span className="text-3xl">{icon}</span>
        <Badge variant={level}>{levelLabel[level]}</Badge>
      </div>

      <h3
        className="mb-2 font-serif text-lg font-bold text-[#f5f0e8] transition-colors group-hover:text-[#c9a84c]"
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        {title}
      </h3>

      <p className="mb-4 line-clamp-2 text-sm text-[#6b6356]">{description}</p>

      <div className="flex items-center justify-between">
        <div className="flex gap-3 text-xs text-[#6b6356]">
          <span>{lessonCount} レッスン</span>
          <span>約 {durationHours} 時間</span>
        </div>
        <span className="text-[#c9a84c] opacity-0 transition-opacity group-hover:opacity-100">
          →
        </span>
      </div>
    </Link>
  );
}
