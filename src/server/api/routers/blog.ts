import { z } from "zod";
import { createTRPCRouter, publicProcedure, editorProcedure } from "../trpc";
import { exclude } from "../../../utils/exclude";

export const blogRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.blog.findMany();
  }
  ),
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.blog.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      return exclude(data, ["createdAt", "updatedAt"])
    }),
  create: editorProcedure
    .input(z.object({
      title: z.string(),
      summary: z.string(),
      markdown: z.string(),
      imageUrl: z.string(),


    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.blog.create({
        data: {
          title: input.title,
          summary: input.summary,
          markdown: input.markdown,
          userId: ctx.session.user.id,
          PrimaryImage: {
            create: {
              imageId: input.imageUrl
            }
          },
        },
      });
    }),
  edit: editorProcedure
    .input(z.object({
      id: z.string(),
      title: z.string(),
      summary: z.string(),
      markdown: z.string(),
      primaryImage: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.blog.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          summary: input.summary,
          markdown: input.markdown,
          PrimaryImage: {
            create: {
              imageId: input.primaryImage
            }
          },
        },
      });
    }),
  delete: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.blog.delete({
        where: {
          id: input.id,
        },
      });
    }
    ),

});