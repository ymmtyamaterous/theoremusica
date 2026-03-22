import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";

import { LevelBadge } from "@/components/level-badge";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/courses/$courseId/")({
  component: CourseDetailComponent,
});

function CourseDetailComponent() {
  const { courseId } = Route.useParams();
  const { data: session } = authClient.useSession();

  const courseQuery = useQuery(
    orpc.courses.getById.queryOptions({
      input: { courseId: Number(courseId) },
    }),
  );

  const enrollmentsQuery = useQuery(
    orpc.enrollments.getMyEnrollments.queryOptions(
      session ? {} : { enabled: false } as never,
    ),
  );

  const completedQuery = useQuery(
    orpc.progress.getCompletedLessonIds.queryOptions(
      session
        ? { input: { courseId: Number(courseId) } }
        : ({ enabled: false } as never),
    ),
  );

  const enrollMutation = useMutation(
    orpc.enrollments.enroll.mutationOptions(),
  );

  const course = courseQuery.data;
  const isEnrolled = enrollmentsQuery.data?.some(
    (e) => e.courseId === Number(courseId),
  );
  const completedLessonIds = completedQuery.data?.completedLessonIds ?? [];

  if (courseQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#0e0d0c" }}>
        <div className="text-[#6b6356]">読み込み中...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#0e0d0c" }}>
        <div className="text-[#6b6356]">コースが見つかりません</div>
      </div>
    );
  }

  const handleEnroll = () => {
    if (!session) {
      window.location.href = "/login";
      return;
    }
    enrollMutation.mutate(
      { courseId: Number(courseId) },
      {
        onSuccess: () => {
          enrollmentsQuery.refetch();
        },
      },
    );
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0e0d0c", color: "#f5f0e8" }}
    >
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* 戻るリンク */}
        <Link
          to="/courses"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#6b6356] transition-colors hover:text-[#c9a84c]"
        >
          <ArrowLeft className="h-4 w-4" />
          コース一覧
        </Link>

        {/* コースヘッダー */}
        <div className="mb-8 rounded-2xl border border-[#2a2520] bg-[#13120f] p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="text-5xl">{course.icon}</span>
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <LevelBadge level={course.level} />
                </div>
                <h1
                  className="mb-2 text-3xl font-bold text-[#f5f0e8]"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {course.title}
                </h1>
                <p className="mb-4 text-[#6b6356]">{course.description}</p>
                <div className="flex items-center gap-6 text-sm text-[#6b6356]">
                  <span className="flex items-center gap-1">
                    <span className="text-[#c9a84c]">♩</span>
                    {course.lessonCount} レッスン
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-[#c9a84c]" />
                    約 {course.durationHours} 時間
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              {isEnrolled ? (
                <div className="rounded-lg border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-5 py-2.5 text-sm font-medium text-[#c9a84c]">
                  受講中 ✓
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleEnroll}
                  disabled={enrollMutation.isPending}
                  className="rounded-lg bg-[#c9a84c] px-5 py-2.5 text-sm font-medium text-[#0e0d0c] transition-colors hover:bg-[#e8cc87] disabled:opacity-50"
                >
                  {enrollMutation.isPending ? "登録中..." : "受講を始める"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* レッスン一覧 */}
        <div>
          <h2
            className="mb-6 text-xl font-bold text-[#f5f0e8]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            レッスン一覧
          </h2>

          <div className="space-y-2">
            {course.lessons.map((lesson) => {
              const isCompleted = completedLessonIds.includes(lesson.id);
              return (
                <Link
                  key={lesson.id}
                  to="/courses/$courseId/lessons/$lessonId"
                  params={{ courseId, lessonId: String(lesson.id) }}
                  className="flex items-center justify-between rounded-xl border border-[#2a2520] bg-[#13120f] px-5 py-4 transition-colors hover:border-[#c9a84c]/30 hover:bg-[#1a1714]"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-6 text-center text-sm text-[#6b6356]">
                      {lesson.order}
                    </span>
                    <span className="font-medium text-[#f5f0e8]">
                      {lesson.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-sm text-[#c9a84c]">
                        <CheckCircle2 className="h-4 w-4" />
                        完了済み
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-sm text-[#6b6356]">
                        <Clock className="h-4 w-4" />
                        {lesson.durationMinutes}分
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
