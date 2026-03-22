import { course, db, enrollment, lesson, lessonProgress } from "@better-t-app/db";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure } from "../index";

export const progressRouter = {
  getMine: protectedProcedure.handler(async ({ context }) => {
    const userId = context.session.user.id;

    // 受講中コース一覧
    const enrollments = await db
      .select({
        courseId: enrollment.courseId,
        courseTitle: course.title,
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt,
        totalLessons: course.lessonCount,
      })
      .from(enrollment)
      .innerJoin(course, eq(enrollment.courseId, course.id))
      .where(eq(enrollment.userId, userId));

    // 完了済みレッスンID一覧
    const completedLessons = await db
      .select({ lessonId: lessonProgress.lessonId })
      .from(lessonProgress)
      .where(eq(lessonProgress.userId, userId));

    const completedLessonIds = new Set(completedLessons.map((r) => r.lessonId));

    // コースごとの完了レッスン数を計算
    const courseProgress = await Promise.all(
      enrollments.map(async (e) => {
        const courseLessons = await db
          .select({ id: lesson.id })
          .from(lesson)
          .where(eq(lesson.courseId, e.courseId));

        const completedCount = courseLessons.filter((l) =>
          completedLessonIds.has(l.id),
        ).length;

        const percentComplete =
          e.totalLessons > 0
            ? Math.round((completedCount / e.totalLessons) * 100)
            : 0;

        return {
          courseId: e.courseId,
          courseTitle: e.courseTitle,
          completedLessons: completedCount,
          totalLessons: e.totalLessons,
          percentComplete,
          enrolledAt: e.enrolledAt,
          completedAt: e.completedAt ?? null,
        };
      }),
    );

    const completedCourses = courseProgress.filter(
      (c) => c.percentComplete === 100,
    ).length;

    return {
      totalCompletedLessons: completedLessonIds.size,
      enrolledCourses: enrollments.length,
      completedCourses,
      courseProgress,
    };
  }),

  getCompletedLessonIds: protectedProcedure
    .input(z.object({ courseId: z.number().optional() }).optional())
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      if (input?.courseId) {
        // 特定コースのレッスンに絞り込み
        const courseLessons = await db
          .select({ id: lesson.id })
          .from(lesson)
          .where(eq(lesson.courseId, input.courseId));

        const lessonIds = courseLessons.map((l) => l.id);

        const completed = await db
          .select({ lessonId: lessonProgress.lessonId })
          .from(lessonProgress)
          .where(
            and(
              eq(lessonProgress.userId, userId),
            ),
          );

        const completedIds = completed
          .map((r) => r.lessonId)
          .filter((id) => lessonIds.includes(id));

        return { completedLessonIds: completedIds };
      }

      const completed = await db
        .select({ lessonId: lessonProgress.lessonId })
        .from(lessonProgress)
        .where(eq(lessonProgress.userId, userId));

      return {
        completedLessonIds: completed.map((r) => r.lessonId),
      };
    }),
};
