import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { CircleOfFifths } from "@/components/circle-of-fifths";
import { CourseCard } from "@/components/course-card";
import { Piano } from "@/components/piano";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const courses = useQuery(orpc.courses.list.queryOptions({ input: {} }));

  return (
    <div style={{ backgroundColor: "#0e0d0c", color: "#f5f0e8" }}>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* 左 */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-4 py-1.5">
              <span className="text-xs font-medium uppercase tracking-widest text-[#c9a84c]">
                音楽の言語を学ぶ
              </span>
            </div>

            <h1
              className="mb-6 text-5xl font-bold leading-tight md:text-6xl"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              音楽を
              <br />
              <span className="italic text-[#c9a84c]">理解する</span>
              <br />
              ための場所
            </h1>

            <p className="mb-8 text-lg leading-relaxed text-[#6b6356]">
              楽譜の読み方からジャズ和声まで、音楽理論を体系的に学べるインタラクティブなプラットフォームです。
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="rounded-lg bg-[#c9a84c] px-6 py-3 font-medium text-[#0e0d0c] transition-colors hover:bg-[#e8cc87]"
              >
                レッスンを始める
              </Link>
              <Link
                to="/courses"
                className="rounded-lg border border-[#c9a84c]/40 px-6 py-3 font-medium text-[#c9a84c] transition-colors hover:border-[#c9a84c] hover:bg-[#c9a84c]/10"
              >
                デモを見る →
              </Link>
            </div>
          </div>

          {/* 右 (ピアノ) */}
          <div className="rounded-2xl border border-[#2a2520] bg-[#13120f] p-8">
            <Piano />
          </div>
        </div>
      </section>

      {/* 区切り線 */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-px flex-1 bg-[#2a2520]" />
          ))}
        </div>
      </div>

      {/* コースセクション */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-3 text-center">
          <span className="text-xs font-medium uppercase tracking-widest text-[#c9a84c]">
            カリキュラム
          </span>
        </div>
        <div className="mb-10 flex items-center justify-between">
          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            コースを選ぶ
          </h2>
          <Link
            to="/courses"
            className="text-sm text-[#c9a84c] transition-colors hover:text-[#e8cc87]"
          >
            すべて見る →
          </Link>
        </div>

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
            {courses.data?.slice(0, 6).map((course) => (
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
      </section>

      {/* インタラクティブ理論セクション */}
      <section className="border-y border-[#2a2520] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            {/* 左 */}
            <div>
              <span className="mb-3 block text-xs font-medium uppercase tracking-widest text-[#c9a84c]">
                インタラクティブツール
              </span>
              <h2
                className="mb-4 text-3xl font-bold"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                五度圏を探索する
              </h2>
              <p className="mb-6 text-[#6b6356]">
                調性の関係を視覚的に理解できるインタラクティブな五度圏です。各セグメントにホバーして調性の関係を探索しましょう。
              </p>
              <ul className="space-y-3 text-sm text-[#6b6356]">
                {[
                  "外周は長調、内周は短調のキーを表示",
                  "隣接するキーは5度の関係",
                  "平行長短調の関係も一目でわかる",
                  "調号の数も五度圏から読み取れる",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="text-[#c9a84c]">♩</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 右 */}
            <div className="flex justify-center">
              <CircleOfFifths />
            </div>
          </div>
        </div>
      </section>

      {/* 統計セクション */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { value: "12K+", label: "学習者が登録" },
            { value: "98", label: "個のレッスン" },
            { value: "4.9", label: "平均評価 (5点満点)" },
            { value: "∞", label: "音楽の可能性" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[#2a2520] bg-[#13120f] p-6 text-center"
            >
              <div
                className="mb-2 text-4xl font-bold text-[#c9a84c]"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-[#6b6356]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
