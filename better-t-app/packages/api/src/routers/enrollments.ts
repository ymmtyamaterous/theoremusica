import { course, db, enrollment } from "@better-t-app/db";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure } from "../index";

export const enrollmentsRouter = {
  enroll: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // コースの存在確認
      const [found] = await db
        .select({ id: course.id })
        .from(course)
        .where(eq(course.id, input.courseId))
        .limit(1);

      if (!found) {
        throw new ORPCError("NOT_FOUND", {
          message: "コースが見つかりません",
        });
      }

      // 既存の受講登録を確認
      const [existing] = await db
        .select()
        .from(enrollment)
        .where(
          and(
            eq(enrollment.userId, userId),
            eq(enrollment.courseId, input.courseId),
          ),
        )
        .limit(1);

      if (existing) {
        return {
          success: true,
          enrolledAt: existing.enrolledAt,
        };
      }

      const [inserted] = await db
        .insert(enrollment)
        .values({
          userId,
          courseId: input.courseId,
        })
        .returning();

      if (!inserted) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "受講登録に失敗しました",
        });
      }

      return {
        success: true,
        enrolledAt: inserted.enrolledAt,
      };
    }),

  getMyEnrollments: protectedProcedure.handler(async ({ context }) => {
    const userId = context.session.user.id;

    const enrollments = await db
      .select({
        courseId: enrollment.courseId,
        courseTitle: course.title,
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt,
      })
      .from(enrollment)
      .innerJoin(course, eq(enrollment.courseId, course.id))
      .where(eq(enrollment.userId, userId));

    return enrollments;
  }),
};
