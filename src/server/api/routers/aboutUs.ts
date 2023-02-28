import { z } from "zod";
import { createTRPCRouter, publicProcedure, editorProcedure } from "../trpc";

const aboutUsOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  markdown: z.string(),
  inUse: z.boolean(),
  primaryImage: z.object({
    format: z.string(),
    height: z.number(),
    width: z.number(),
    public_Id: z.string(),
    id: z.string(),
    blur_url: z.string(),
  }),
  secondaryImage: z.object({
    format: z.string(),
    height: z.number(),
    width: z.number(),
    public_Id: z.string(),
    id: z.string(),
    blur_url: z.string(),
  }),
});





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
        include: {
          primaryImage: {
            select: {
              image: {
                select: {
                  format: true,
                  height: true,
                  width: true,
                  public_Id: true,
                  id: true,
                  blur_url: true,
                },
              }
            }
          },
          secondaryImage: {
            select: {
              image: {
                select: {
                  format: true,
                  height: true,
                  width: true,
                  public_Id: true,
                  id: true,
                  blur_url: true,
                },
              }
            }
          },
        },
      });
    }),
  getCurrent: publicProcedure
    .output(aboutUsOutputSchema)
    .query(async ({ ctx }) => {
      const aboutUs = await ctx.prisma.aboutUs.findFirstOrThrow({
        where: {
          inUse: true,
        },
      })
      const primaryImage = await ctx.prisma.image.findFirstOrThrow({
        where: {
          primaryImage: {
            some: {
              aboutUsId: aboutUs.id,
            }
          }
        },
      })
      const secondaryImage = await ctx.prisma.image.findFirstOrThrow({
        where: {
          secondaryImage: {
            some: {
              aboutUsId: aboutUs.id,
            }
          }
        }
      })
      return {
        ...aboutUs,
        primaryImage: primaryImage,
        secondaryImage: secondaryImage
      }

    }
    ),
  create: editorProcedure
    .input(z.object({
      title: z.string(),
      summary: z.string(),
      markdown: z.string(),
      primaryImage: z.string(),
      secondaryImage: z.string(),


    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.aboutUs.create({
        data: {
          title: input.title,
          summary: input.summary,
          markdown: input.markdown,
          primaryImage: {
            create: {
              imageId: input.primaryImage
            }
          },
          secondaryImage: {
            create: {
              imageId: input.secondaryImage
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
      secondaryImage: z.string(),

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
          primaryImage: {
            create: {
              imageId: input.primaryImage
            }
          },
          secondaryImage: {
            create: {
              imageId: input.secondaryImage
            }
          },
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