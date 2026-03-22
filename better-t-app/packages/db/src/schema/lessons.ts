import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { course } from "./courses";
import { lessonProgress } from "./lessonProgress";

export const lesson = sqliteTable(
  "lesson",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    courseId: integer("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: text("content").notNull(),
    order: integer("order").notNull().default(0),
    durationMinutes: integer("duration_minutes").notNull().default(15),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("lesson_courseId_order_idx").on(table.courseId, table.order),
  ],
);

export const lessonRelations = relations(lesson, ({ one, many }) => ({
  course: one(course, {
    fields: [lesson.courseId],
    references: [course.id],
  }),
  lessonProgresses: many(lessonProgress),
}));
