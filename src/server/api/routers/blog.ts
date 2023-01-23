import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const blogRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.blog.findMany();
  }
  ),
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.blog.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      summary: z.string(),
      longForm: z.string(),
      imageUrl: z.string(),


    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.blog.create({
        data: {
          title: input.title,
          summary: input.summary,
          longForm: input.longForm,
          imageUrl: input.imageUrl,
          userId: ctx.session.user.id
        },
      });
    }),
  edit: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string(),
      summary: z.string(),
      longForm: z.string(),
      imageUrl: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.blog.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          summary: input.summary,
          longForm: input.longForm,
          imageUrl: input.imageUrl,
        },
      });
    }),
});