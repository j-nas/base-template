import { z } from "zod";
import { createTRPCRouter, publicProcedure, editorProcedure } from "../trpc";
import { exclude } from "../../../utils/exclude";


export const heroRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.hero.findMany();
  }
  ),
  getTop: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.hero.findUniqueOrThrow({
      where: {
        position: "TOP",
      },
      include: {
        PrimaryImage: {
          include: {
            image: {
              select: {
                id: true,
                height: true,
                width: true,
                public_Id: true,
                format: true,
              }
            }
          }
        }
      },
    });
    return exclude(data, ["createdAt"]);

  }
  ),
  getBottom: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.hero.findUniqueOrThrow({
      where: {
        position: "BOTTOM",
      },
      include: {
        PrimaryImage: {
          include: {
            image: {
              select: {
                id: true,
                height: true,
                width: true,
                public_Id: true,
                format: true,
              }
            }
          }
        }
      },
    });
    return exclude(data, ["createdAt"]);



  }
  ),
  getFront: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.hero.findUniqueOrThrow({
      where: {
        position: "FRONT",
      },
      include: {
        PrimaryImage: {
          include: {
            image: {
              select: {
                id: true,
                height: true,
                width: true,
                public_Id: true,
                format: true,
              }
            }
          }
        }
      },
    });
    return exclude(data, ["createdAt"]);
  }
  ),
  create: editorProcedure
    .input(z.object({
      heading: z.string(),
      ctaText: z.string(),
      primaryImage: z.string(),

    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.hero.create({
        data: {
          heading: input.heading,
          ctaText: input.ctaText,
          PrimaryImage: {
            connect: {
              id: input.primaryImage,
            },
          },
        },
      });
    }
    ),
  edit: editorProcedure
    .input(z.object({
      id: z.string(),
      heading: z.string(),
      ctaText: z.string(),
      primaryImage: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.hero.update({
        where: {
          id: input.id,
        },
        data: {
          heading: input.heading,
          ctaText: input.ctaText,
          PrimaryImage: {
            connect: {
              id: input.primaryImage,
            },
          },
        },
      });
    }
    ),
  delete: editorProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.hero.delete({
        where: {
          id: input.id,
        },
      });
    }
    ),
  setTop: editorProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction([
        ctx.prisma.hero.update({
          where: {
            position: "TOP",
          },
          data: {
            position: undefined,
          },
        }),
        ctx.prisma.hero.update({
          where: {
            id: input.id,
          },
          data: {
            position: "TOP",
          },
        }),
      ]);
    }
    ),
  setBottom: editorProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction([
        ctx.prisma.hero.update({
          where: {
            position: "BOTTOM",
          },
          data: {
            position: undefined,
          },
        }),
        ctx.prisma.hero.update({
          where: {
            id: input.id,
          },
          data: {
            position: "BOTTOM",
          },
        }),
      ]);
    }
    ),
  setFront: editorProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction([
        ctx.prisma.hero.update({
          where: {
            position: "FRONT",
          },
          data: {
            position: undefined,
          },
        }),
        ctx.prisma.hero.update({
          where: {
            id: input.id,
          },
          data: {
            position: "FRONT",
          },
        }),
      ]);
    }
    ),
});
