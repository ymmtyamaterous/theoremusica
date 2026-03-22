import { db, lesson, lessonProgress } from "@better-t-app/db";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure, publicProcedure } from "../index";

export const lessonsRouter = {
  getById: publicProcedure
    .input(z.object({ lessonId: z.number() }))
    .handler(async ({ input }) => {
      const [found] = await db
        .select()
        .from(lesson)
        .where(eq(lesson.id, input.lessonId))
        .limit(1);

      if (!found) {
        throw new ORPCError("NOT_FOUND", {
          message: "レッスンが見つかりません",
        });
      }

      // 前後のレッスンを取得
      const siblings = await db
        .select({ id: lesson.id, order: lesson.order })
        .from(lesson)
        .where(eq(lesson.courseId, found.courseId));

      const sorted = siblings.sort((a, b) => a.order - b.order);
      const currentIdx = sorted.findIndex((l) => l.id === found.id);
      const prevLesson = currentIdx > 0 ? sorted[currentIdx - 1] : null;
      const nextLesson =
        currentIdx < sorted.length - 1 ? sorted[currentIdx + 1] : null;

      return {
        ...found,
        prevLessonId: prevLesson?.id ?? null,
        nextLessonId: nextLesson?.id ?? null,
      };
    }),

  complete: protectedProcedure
    .input(z.object({ lessonId: z.number() }))
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // 既存の完了記録を確認
      const [existing] = await db
        .select()
        .from(lessonProgress)
        .where(
          and(
            eq(lessonProgress.userId, userId),
            eq(lessonProgress.lessonId, input.lessonId),
          ),
        )
        .limit(1);

      if (existing) {
        return {
          success: true,
          completedAt: existing.completedAt,
        };
      }

      const [inserted] = await db
        .insert(lessonProgress)
        .values({
          userId,
          lessonId: input.lessonId,
        })
        .returning();

      if (!inserted) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "レッスン完了の記録に失敗しました",
        });
      }

      return {
        success: true,
        completedAt: inserted.completedAt,
      };
    }),
};
