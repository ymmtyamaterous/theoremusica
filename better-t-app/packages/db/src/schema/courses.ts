import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { enrollment } from "./enrollments";
import { lesson } from "./lessons";

export const course = sqliteTable("course", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: text("level", {
    enum: ["beginner", "intermediate", "advanced"],
  }).notNull(),
  icon: text("icon").notNull(),
  lessonCount: integer("lesson_count").notNull().default(0),
  durationHours: integer("duration_hours").notNull().default(0),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});

export const courseRelations = relations(course, ({ many }) => ({
  lessons: many(lesson),
  enrollments: many(enrollment),
}));
