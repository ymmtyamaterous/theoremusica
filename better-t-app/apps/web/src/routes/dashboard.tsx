import { Progress } from "@better-t-app/ui/components/progress";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { BookOpen, GraduationCap, Trophy } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/dashboard")({
  component: DashboardComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({
        to: "/login",
        throw: true,
      });
    }
    return { session };
  },
});

function DashboardComponent() {
  const { session } = Route.useRouteContext();

  const progressQuery = useQuery(orpc.progress.getMine.queryOptions());

  const progress = progressQuery.data;
  const userName = session.data?.user.name ?? "ゲスト";

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0e0d0c", color: "#f5f0e8" }}
    >
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* ウェルカムメッセージ */}
        <div className="mb-10">
          <h1
            className="mb-1 text-3xl font-bold"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            おかえりなさい, {userName} 👋
          </h1>
          <p className="text-[#6b6356]">今日も音楽理論を学びましょう</p>
        </div>

        {/* サマリーカード */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#2a2520] bg-[#13120f] p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-[#c9a84c]/10 p-2">
                <BookOpen className="h-5 w-5 text-[#c9a84c]" />
              </div>
              <span className="text-sm text-[#6b6356]">完了レッスン</span>
            </div>
            <div
              className="text-4xl font-bold text-[#f5f0e8]"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {progress?.totalCompletedLessons ?? 0}
            </div>
          </div>

          <div className="rounded-xl border border-[#2a2520] bg-[#13120f] p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-[#c9a84c]/10 p-2">
                <GraduationCap className="h-5 w-5 text-[#c9a84c]" />
              </div>
              <span className="text-sm text-[#6b6356]">受講コース</span>
            </div>
            <div
              className="text-4xl font-bold text-[#f5f0e8]"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {progress?.enrolledCourses ?? 0}
            </div>
          </div>

          <div className="rounded-xl border border-[#2a2520] bg-[#13120f] p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-[#c9a84c]/10 p-2">
                <Trophy className="h-5 w-5 text-[#c9a84c]" />
              </div>
              <span className="text-sm text-[#6b6356]">完了コース</span>
            </div>
            <div
              className="text-4xl font-bold text-[#f5f0e8]"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {progress?.completedCourses ?? 0}
            </div>
          </div>
        </div>

        {/* 受講中のコース */}
        <div>
          <h2
            className="mb-6 text-xl font-bold text-[#f5f0e8]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            受講中のコース
          </h2>

          {progressQuery.isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-xl bg-[#13120f]"
                />
              ))}
            </div>
          ) : progress?.courseProgress.length === 0 ? (
            <div className="rounded-2xl border border-[#2a2520] bg-[#13120f] p-10 text-center">
              <p className="mb-4 text-[#6b6356]">
                まだ受講中のコースがありません
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-lg bg-[#c9a84c] px-5 py-2.5 text-sm font-medium text-[#0e0d0c] transition-colors hover:bg-[#e8cc87]"
              >
                コースを探す →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {progress?.courseProgress.map((cp) => (
                <Link
                  key={cp.courseId}
                  to="/courses/$courseId"
                  params={{ courseId: String(cp.courseId) }}
                  className="block rounded-xl border border-[#2a2520] bg-[#13120f] p-6 transition-colors hover:border-[#c9a84c]/30 hover:bg-[#1a1714]"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-medium text-[#f5f0e8]">
                      {cp.courseTitle}
                    </span>
                    <span className="text-sm text-[#c9a84c]">
                      {cp.completedLessons}/{cp.totalLessons} レッスン
                    </span>
                  </div>
                  <Progress
                    value={cp.completedLessons}
                    max={cp.totalLessons}
                    className="h-2"
                  />
                  <p className="mt-1 text-right text-xs text-[#6b6356]">
                    {cp.percentComplete}%
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}