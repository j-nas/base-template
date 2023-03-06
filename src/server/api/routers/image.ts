import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const imageRouter = createTRPCRouter({
  getTotalSize: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.image.aggregate({
      _sum: {
        bytes: true,
      }
    });

    return data;
  }
  ),
});