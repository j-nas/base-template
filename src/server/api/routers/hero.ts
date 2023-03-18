import { z } from "zod";
import { createTRPCRouter, publicProcedure, adminProcedure } from "../trpc";
import { HeroPosition } from "@prisma/client";


export const heroRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.hero.findMany();
  }
  ),
  getByPosition: publicProcedure
    .input(z.object({ position: z.nativeEnum(HeroPosition) }))
    .output(z.object({
      id: z.string(),
      heading: z.string(),
      ctaText: z.string(),
      position: z.nativeEnum(HeroPosition).nullable(),
      primaryImage: z.object({
        id: z.string(),
        height: z.number(),
        width: z.number(),
        public_id: z.string(),
        format: z.string(),
        blur_url: z.string(),
      })
    }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.hero.findUniqueOrThrow({
        where: {
          position: input.position,
        },

      });

      const image = await ctx.prisma.image.findFirstOrThrow({
        where: {
          primaryImage: {
            some: {
              heroId: data.id,
            }
          }
        },
      });

      return { ...data, primaryImage: image }
    }
    ),

  create: adminProcedure
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
          primaryImage: {
            connect: {
              id: input.primaryImage,
            },
          },
        },
      });
    }
    ),
  edit: adminProcedure
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
          primaryImage: {
            connect: {
              id: input.primaryImage,
            },
          },
        },
      });
    }
    ),
  delete: adminProcedure
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
  setTop: adminProcedure
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
  setBottom: adminProcedure
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
  setFront: adminProcedure
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
