import { course, db, lesson } from "@better-t-app/db";
import { ORPCError } from "@orpc/server";
import { eq, asc } from "drizzle-orm";
import { z } from "zod";

import { publicProcedure } from "../index";

export const coursesRouter = {
  list: publicProcedure
    .input(
      z
        .object({
          level: z
            .enum(["beginner", "intermediate", "advanced"])
            .optional(),
        })
        .optional(),
    )
    .handler(async ({ input }) => {
      const query = db
        .select()
        .from(course)
        .orderBy(asc(course.order));

      const courses = await query;

      if (input?.level) {
        return courses.filter((c) => c.level === input.level);
      }

      return courses;
    }),

  getById: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .handler(async ({ input }) => {
      const [found] = await db
        .select()
        .from(course)
        .where(eq(course.id, input.courseId))
        .limit(1);

      if (!found) {
        throw new ORPCError("NOT_FOUND", { message: "コースが見つかりません" });
      }

      const lessons = await db
        .select({
          id: lesson.id,
          title: lesson.title,
          order: lesson.order,
          durationMinutes: lesson.durationMinutes,
        })
        .from(lesson)
        .where(eq(lesson.courseId, input.courseId))
        .orderBy(asc(lesson.order));

      return {
        ...found,
        lessons,
      };
    }),
};
