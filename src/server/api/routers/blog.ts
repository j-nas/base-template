import { z } from "zod";
import { createTRPCRouter, publicProcedure, adminProcedure, protectedProcedure } from "../trpc";
import { exclude } from "../../../utils/exclude";

const blogSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  markdown: z.string(),
  featured: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  author: z.object({
    name: z.string(),
    image: z.object({
      id: z.string(),
      height: z.number(),
      width: z.number(),
      public_id: z.string(),
      format: z.string(),
      blur_url: z.string(),
    }).nullable(),
  }),
  image: z.object({
    id: z.string(),
    height: z.number(),
    width: z.number(),
    public_id: z.string(),
    format: z.string(),
    blur_url: z.string(),
  }).nullish(),
});


export const blogRouter = createTRPCRouter({
  // getAll: publicProcedure
  //   .output(z.array(blogSchema))
  //   .query(async ({ ctx }) => {
  //     const data = await ctx.prisma.blog.findMany({
  //       include: {
  //         primaryImage: {
  //           select: {
  //             image: true,
  //           }
  //         },
  //         author: {
  //           select: {
  //             name: true,
  //             image: true,
  //           }
  //         }
  //       },
  //     });

  //     return data.map((blog) => {
  //       return {
  //         ...blog,
  //         image: blog.primaryImage?.image,
  //         createdAt: blog.createdAt.toISOString(),
  //         updatedAt: blog.updatedAt.toISOString(),
  //         author: blog.author?.name || "Unknown",
  //       }
  //     })
  //   }),
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
          author: {
            select: {
              name: true,
              avatarImage: {
                select: {
                  image: true,
                }
              }
            }
          }
        },
      });

      return data.map((blog) => {
        return {
          ...blog,
          pageName: blog.title.toLowerCase().replace(/ /g, "-"),
          image: blog.primaryImage?.image,
          createdAt: blog.createdAt.toISOString(),
          updatedAt: blog.updatedAt.toISOString(),
          author: {
            name: blog.author?.name || "Unknown",
            image: blog.author?.avatarImage?.image || null,
          }
        }
      })
    }),
  getByPageName: publicProcedure
    .output(blogSchema)
    .input(z.object({ pageName: z.string() }))
    .query(async ({ ctx, input }) => {
      const pageFormatted = input.pageName.replace(/-/g, " ");
      const data = await ctx.prisma.blog.findFirst({
        where: {
          title: {
            startsWith: pageFormatted,
            mode: "insensitive",

          },
        },
        include: {
          primaryImage: {
            select: {
              image: true,
            }
          },
          author: {
            select: {
              name: true,
              avatarImage: {
                select: {
                  image: true,
                }
              }
            }
          }

        },
      });

      if (!data) {
        throw new Error("Blog not found");
      }

      return {
        ...data,
        pageName: data.title.toLowerCase().replace(/ /g, "-"),
        image: data.primaryImage?.image,
        createdAt: data.createdAt.toISOString(),
        updatedAt: data.updatedAt.toISOString(),
        author: {
          name: data.author?.name || "Unknown",
          image: data.author?.avatarImage?.image || null,
        }
      }
    }),




  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.blog.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      return exclude(data, ["createdAt", "updatedAt"])
    }),
  create: adminProcedure
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
  edit: adminProcedure
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
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.blog.delete({
        where: {
          id: input.id,
        },
      });
    }
    ),
  countBlogsByUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.blog.count({
        where: {
          userId: input.userId,
        },
      });
    }
    ),

});