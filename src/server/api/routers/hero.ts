import { z } from "zod";
import { createTRPCRouter, publicProcedure, adminProcedure } from "../trpc";
import { HeroPosition, type Image } from "@prisma/client";


export const heroRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.hero.findMany({
      include: {
        primaryImage: {
          select: {
            image: true,
          },
        },
      },
    });

    return data.map((item) => {
      return {
        ...item,
        primaryImage: item.primaryImage?.image as Image,
      };
    }
    );


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


  update: adminProcedure
    .input(z.object({
      heading: z.string(),
      ctaText: z.string(),
      primaryImage: z.string(),
      position: z.nativeEnum(HeroPosition)
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.hero.update({
        where: {
          position: input.position
        },
        data: {
          heading: input.heading,
          ctaText: input.ctaText,
          primaryImage: {
            update: {
              image: {
                connect: {
                  public_id: input.primaryImage,
                },
              },
            },
          },
        },
      });
    }
    ),

});
