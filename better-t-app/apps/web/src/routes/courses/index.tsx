import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { CourseCard } from "@/components/course-card";
import { orpc } from "@/utils/orpc";

type Level = "beginner" | "intermediate" | "advanced" | "all";

export const Route = createFileRoute("/courses/")({
  component: CoursesComponent,
});

function CoursesComponent() {
  const [filter, setFilter] = useState<Level>("all");
  const courses = useQuery(orpc.courses.list.queryOptions({ input: {} }));

  const filtered =
    filter === "all"
      ? (courses.data ?? [])
      : (courses.data ?? []).filter((c) => c.level === filter);

  const tabs: { value: Level; label: string }[] = [
    { value: "all", label: "すべて" },
    { value: "beginner", label: "入門" },
    { value: "intermediate", label: "中級" },
    { value: "advanced", label: "上級" },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0e0d0c", color: "#f5f0e8" }}
    >
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* ヘッダー */}
        <div className="mb-10">
          <span className="mb-3 block text-xs font-medium uppercase tracking-widest text-[#c9a84c]">
            カリキュラム
          </span>
          <h1
            className="mb-2 text-4xl font-bold"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            すべてのコース
          </h1>
          <p className="text-[#6b6356]">
            音楽理論の基礎から応用まで、あなたのペースで学習できます。
          </p>
        </div>

        {/* フィルタ */}
        <div className="mb-10 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              className={[
                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                filter === tab.value
                  ? "bg-[#c9a84c] text-[#0e0d0c]"
                  : "border border-[#2a2520] text-[#6b6356] hover:border-[#c9a84c]/40 hover:text-[#f5f0e8]",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* コース一覧 */}
        {courses.isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-xl bg-[#13120f]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                level={course.level}
                icon={course.icon}
                lessonCount={course.lessonCount}
                durationHours={course.durationHours}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
