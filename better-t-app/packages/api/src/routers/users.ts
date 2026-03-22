import { db, user } from "@better-t-app/db";
import { eq } from "drizzle-orm";
import { ORPCError } from "@orpc/server";

import { protectedProcedure } from "../index";

export const usersRouter = {
  getMe: protectedProcedure.handler(async ({ context }) => {
    const userId = context.session.user.id;

    const [found] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!found) {
      throw new ORPCError("NOT_FOUND", {
        message: "ユーザーが見つかりません",
      });
    }

    return found;
  }),
};
