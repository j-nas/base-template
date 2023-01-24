import { z } from "zod";
import { createTRPCRouter, publicProcedure, editorProcedure } from "../trpc";
import { exclude } from "../../../utils/exclude";

export const aboutUsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.aboutUs.findMany();
  }
  ),
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.aboutUs.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getCurrent: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.aboutUs.findFirstOrThrow({
      where: {
        inUse: true,
      },
    });
    return exclude(data, ["createdAt"]);
  }
  ),
  create: editorProcedure
    .input(z.object({
      title: z.string(),
      summary: z.string(),
      markdown: z.string(),
      imageUrl: z.string(),
      insetImageUrl: z.string(),


    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.aboutUs.create({
        data: {
          title: input.title,
          summary: input.summary,
          markdown: input.markdown,
          imageUrl: input.imageUrl,
          insetImageUrl: input.insetImageUrl,
        },
      });
    }),
  edit: editorProcedure
    .input(z.object({
      id: z.string(),
      title: z.string(),
      summary: z.string(),
      markdown: z.string(),
      imageUrl: z.string(),
      insetImageUrl: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.aboutUs.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          summary: input.summary,
          markdown: input.markdown,
          imageUrl: input.imageUrl,
          insetImageUrl: input.insetImageUrl,
        },
      });
    }),
  delete: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.aboutUs.delete({
        where: {
          id: input.id,
        },
      });
    }
    ),

});