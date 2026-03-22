import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { LessonSidebar } from "@/components/lesson-sidebar";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute(
  "/courses/$courseId/lessons/$lessonId",
)({
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({ to: "/login", throw: true });
    }
  },
  component: LessonComponent,
});

function LessonComponent() {
  const { courseId, lessonId } = Route.useParams();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  const lessonQuery = useQuery(
    orpc.lessons.getById.queryOptions({
      input: { lessonId: Number(lessonId) },
    }),
  );

  const courseQuery = useQuery(
    orpc.courses.getById.queryOptions({
      input: { courseId: Number(courseId) },
    }),
  );

  const completedQuery = useQuery(
    orpc.progress.getCompletedLessonIds.queryOptions({
      input: { courseId: Number(courseId) },
    }),
  );

  const completeMutation = useMutation(orpc.lessons.complete.mutationOptions());

  const lesson = lessonQuery.data;
  const course = courseQuery.data;
  const completedLessonIds = completedQuery.data?.completedLessonIds ?? [];
  const isCompleted = completedLessonIds.includes(Number(lessonId));

  const handleComplete = () => {
    completeMutation.mutate(
      { lessonId: Number(lessonId) },
      {
        onSuccess: () => {
          completedQuery.refetch();
          if (lesson?.nextLessonId) {
            navigate({
              to: "/courses/$courseId/lessons/$lessonId",
              params: { courseId, lessonId: String(lesson.nextLessonId) },
            });
          }
        },
      },
    );
  };

  if (lessonQuery.isLoading || courseQuery.isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#0e0d0c" }}
      >
        <div className="text-[#6b6356]">読み込み中...</div>
      </div>
    );
  }

  if (!lesson || !course) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#0e0d0c" }}
      >
        <div className="text-[#6b6356]">レッスンが見つかりません</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0e0d0c", color: "#f5f0e8" }}
    >
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* 戻るリンク */}
        <Link
          to="/courses/$courseId"
          params={{ courseId }}
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#6b6356] transition-colors hover:text-[#c9a84c]"
        >
          <ArrowLeft className="h-4 w-4" />
          {course.title}
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
          {/* メインコンテンツ */}
          <div>
            <div className="mb-6 rounded-2xl border border-[#2a2520] bg-[#13120f] p-8">
              <h1
                className="mb-6 text-3xl font-bold text-[#f5f0e8]"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {lesson.title}
              </h1>

              {/* Markdown コンテンツ */}
              <div className="prose prose-invert max-w-none prose-headings:font-serif prose-headings:text-[#f5f0e8] prose-p:text-[#ede7d8] prose-strong:text-[#c9a84c] prose-li:text-[#ede7d8] prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg">
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
              </div>
            </div>

            {/* ナビゲーション */}
            <div className="flex items-center justify-between">
              <div>
                {lesson.prevLessonId ? (
                  <Link
                    to="/courses/$courseId/lessons/$lessonId"
                    params={{
                      courseId,
                      lessonId: String(lesson.prevLessonId),
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#2a2520] px-4 py-2 text-sm text-[#6b6356] transition-colors hover:border-[#c9a84c]/30 hover:text-[#f5f0e8]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    前のレッスン
                  </Link>
                ) : null}
              </div>

              <div>
                {isCompleted ? (
                  <div className="inline-flex items-center gap-2 rounded-lg border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-5 py-2.5 text-sm font-medium text-[#c9a84c]">
                    <CheckCircle2 className="h-4 w-4" />
                    完了済み
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleComplete}
                    disabled={completeMutation.isPending}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#c9a84c] px-5 py-2.5 text-sm font-medium text-[#0e0d0c] transition-colors hover:bg-[#e8cc87] disabled:opacity-50"
                  >
                    {completeMutation.isPending
                      ? "完了処理中..."
                      : "このレッスンを完了"}
                    {!completeMutation.isPending && (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <LessonSidebar
            courseId={Number(courseId)}
            currentLessonId={Number(lessonId)}
            lessons={course.lessons}
            completedLessonIds={completedLessonIds}
            totalLessons={course.lessonCount}
          />
        </div>
      </div>
    </div>
  );
}
