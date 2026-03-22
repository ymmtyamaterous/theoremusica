import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "../index";
import { coursesRouter } from "./courses";
import { enrollmentsRouter } from "./enrollments";
import { lessonsRouter } from "./lessons";
import { progressRouter } from "./progress";
import { usersRouter } from "./users";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),
  courses: coursesRouter,
  lessons: lessonsRouter,
  progress: progressRouter,
  users: usersRouter,
  enrollments: enrollmentsRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
