import { z } from "zod";
import { createTRPCRouter, publicProcedure, editorProcedure } from "../trpc";
import { exclude } from "../../../utils/exclude";

const blogSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  markdown: z.string(),
  featured: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  image: z.object({
    id: z.string(),
    height: z.number(),
    width: z.number(),
    public_Id: z.string(),
    format: z.string(),
    blur_url: z.string(),
  }).nullish(),
});


export const blogRouter = createTRPCRouter({
  getAll: publicProcedure
    .output(z.array(blogSchema))
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.blog.findMany({
        include: {
          primaryImage: {
            select: {
              image: true,
            }
          },
        },
      });
      return data.map((blog) => {
        return {
          ...blog,
          image: blog.primaryImage?.image,
          createdAt: blog.createdAt.toISOString(),
          updatedAt: blog.updatedAt.toISOString()
        }
      })
    }),
  getSummaries: publicProcedure
    .output(z.array(
      blogSchema.omit({ markdown: true }).extend({ pageName: z.string() })
    ))
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.blog.findMany({
        include: {
          primaryImage: {
            select: {
              image: true,
            }
          },
        },
      });
      return data.map((blog) => {
        return {
          ...blog,
          pageName: blog.title.toLowerCase().replace(/ /g, "-"),
          image: blog.primaryImage?.image,
          createdAt: blog.createdAt.toISOString(),
          updatedAt: blog.updatedAt.toISOString()
        }
      })
    }),

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
          primaryImage: {
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
          primaryImage: {
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