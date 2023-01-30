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
        include: {
          PrimaryImage: {
            select: {
              image: {
                select: {
                  format: true,
                  height: true,
                  width: true,
                  public_Id: true,
                  id: true,
                },
              }
            }
          },
          SecondaryImage: {
            select: {
              image: {
                select: {
                  format: true,
                  height: true,
                  width: true,
                  public_Id: true,
                  id: true,
                },
              }
            }
          },
        },
      });
    }),
  getCurrent: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.aboutUs.findFirstOrThrow({
      where: {
        inUse: true,
      },
      include: {
        PrimaryImage: {
          select: {
            image: {
              select: {
                format: true,
                height: true,
                width: true,
                public_Id: true,
                id: true,
              },
            }
          }
        },
        SecondaryImage: {
          select: {
            image: {
              select: {
                format: true,
                height: true,
                width: true,
                public_Id: true,
                id: true,
              },
            }
          }
        },
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
      primaryImage: z.string(),
      secondaryImage: z.string(),


    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.aboutUs.create({
        data: {
          title: input.title,
          summary: input.summary,
          markdown: input.markdown,
          PrimaryImage: {
            create: {
              imageId: input.primaryImage
            }
          },
          SecondaryImage: {
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
          PrimaryImage: {
            create: {
              imageId: input.primaryImage
            }
          },
          SecondaryImage: {
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