import { Progress } from "@better-t-app/ui/components/progress";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Circle } from "lucide-react";

interface LessonItem {
  id: number;
  title: string;
  order: number;
  durationMinutes: number;
}

interface LessonSidebarProps {
  courseId: number;
  currentLessonId: number;
  lessons: LessonItem[];
  completedLessonIds: number[];
  totalLessons: number;
}

export function LessonSidebar({
  courseId,
  currentLessonId,
  lessons,
  completedLessonIds,
  totalLessons,
}: LessonSidebarProps) {
  const completedCount = completedLessonIds.length;
  const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <aside className="flex h-full flex-col gap-4 rounded-xl border border-[#2a2520] bg-[#13120f] p-4">
      {/* 進捗 */}
      <div>
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="text-[#f5f0e8]">コース進捗</span>
          <span className="text-[#c9a84c]">
            {completedCount}/{totalLessons}
          </span>
        </div>
        <Progress value={completedCount} max={totalLessons} />
        <p className="mt-1 text-right text-xs text-[#6b6356]">{percent}%</p>
      </div>

      {/* レッスン一覧 */}
      <div className="flex-1 overflow-y-auto">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#6b6356]">
          レッスン一覧
        </p>
        <ul className="space-y-1">
          {lessons.map((lesson) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            const isCurrent = lesson.id === currentLessonId;

            return (
              <li key={lesson.id}>
                <Link
                  to="/courses/$courseId/lessons/$lessonId"
                  params={{
                    courseId: String(courseId),
                    lessonId: String(lesson.id),
                  }}
                  className={[
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    isCurrent
                      ? "bg-[#c9a84c]/15 text-[#c9a84c]"
                      : "text-[#6b6356] hover:bg-[#1a1714] hover:text-[#f5f0e8]",
                  ].join(" ")}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#c9a84c]" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-[#2a2520]" />
                  )}
                  <span className="line-clamp-1">{lesson.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
