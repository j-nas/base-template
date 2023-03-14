import { z } from "zod";
import { createTRPCRouter, publicProcedure, editorProcedure } from "../trpc";
import { Services } from "@prisma/client";
import { exclude } from "../../../utils/exclude";
import * as icons from "react-icons/fa"

const IconKeys = Object.keys(icons) as (keyof typeof icons)[];





const serviceSchema = z.object({
  id: z.string(),
  pageName: z.string(),
  title: z.string(),
  shortDescription: z.string(),
  markdown: z.string(),
  icon: z.custom((value) => {
    if (IconKeys.includes(value as any)) {
      return value;
    } else {
      return z.ZodIssueCode.custom;

    }
  }),

  position: z.nativeEnum(Services).nullable(),

  primaryImage: z.object({
    id: z.string(),
    height: z.number(),
    width: z.number(),
    public_id: z.string(),
    format: z.string(),
    blur_url: z.string(),
  }),

  secondaryImage: z.object({
    id: z.string(),
    height: z.number(),
    width: z.number(),
    public_id: z.string(),
    format: z.string(),
    blur_url: z.string(),
  })
})

export const serviceRouter = createTRPCRouter({

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.service.findMany({
      include: {
        primaryImage: {
          select: {
            image: true,
          }
        },
        secondaryImage: {
          select: {
            image: true,
          }
        },
      },
    });
  }
  ),
  getAllAdmin: publicProcedure
    .output(z.object({
      id: z.string(),
      pageName: z.string(),
      title: z.string(),
      shortDescription: z.string(),
      markdown: z.string(),
      icon: z.custom((value) => {
        if (IconKeys.includes(value as any)) {
          return value;
        } else {
          return z.ZodIssueCode.custom;

        }
      }),
      updatedAt: z.date(),

      position: z.nativeEnum(Services).nullable(),
    }).array())
    .query(async ({ ctx }) => {
      return await ctx.prisma.service.findMany({
        where: {
          position: {
            not: null,
          }
        }
      });
    }
    ),
  getByPageName: publicProcedure
    .input(z.object({ pageName: z.string() }))
    .output(serviceSchema)
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.service.findUniqueOrThrow({
        where: {
          pageName: input.pageName,
        },


      });
      const primaryImage = await ctx.prisma.image.findFirstOrThrow({
        where: {
          primaryImage: {
            some: {
              serviceId: data.id,
            }
          }
        },
      });
      const secondaryImage = await ctx.prisma.image.findFirstOrThrow({
        where: {
          secondaryImage: {
            some: {
              serviceId: data.id,
            }
          }
        },
      });



      return { ...data, primaryImage: primaryImage, secondaryImage: secondaryImage }

    }
    ),

  getActive: publicProcedure
    .output(serviceSchema.array())
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.service.findMany({
        where: {
          position: {
            not: null,
          },
        },
      });

      const services = data.map(async (service) => {
        return {
          ...service,
          primaryImage: await ctx.prisma.image.findFirstOrThrow({
            where: {
              primaryImage: {
                some: {
                  serviceId: service.id,
                }
              }
            }
          }),
          secondaryImage: await ctx.prisma.image.findFirstOrThrow({
            where: {
              secondaryImage: {
                some: {
                  serviceId: service.id,
                }
              }
            }
          })
        }
      })

      return await Promise.all(services);

    }
    ),
  getByPosition: publicProcedure
    .output(serviceSchema.extend({
      createdAt: z.date(),
      updatedAt: z.date(),
    }))
    .input(z.object({ position: z.nativeEnum(Services) }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.service.findUniqueOrThrow({
        where: {
          position: input.position,
        },
        include: {
          primaryImage: {
            select: {
              image: true,

            },

          },
          secondaryImage: {
            select: {
              image: true,
            },
          },
        },
      });
      if (!data.primaryImage || !data.secondaryImage) {
        throw new Error("No image found")
      }

      return { ...data, primaryImage: data.primaryImage?.image, secondaryImage: data?.secondaryImage?.image }
    }

    ),


  swapPosition: publicProcedure
    .input(z.object({
      existingPosition: z.nativeEnum(Services),
      requestedPosition: z.nativeEnum(Services),
    }))
    .mutation(async ({ ctx, input }) => {
      const swapService = await ctx.prisma.service.update({
        where: {
          position: input.requestedPosition,
        },
        data: {
          position: null,
        },
      });
      const newPosition = await ctx.prisma.service.update({
        where: {
          position: input.existingPosition,
        },
        data: {
          position: input.requestedPosition,
        },
      });
      await ctx.prisma.service.update({
        where: {
          id: swapService.id,
        },
        data: {
          position: input.existingPosition,
        },
      });

      return newPosition;
    }),



});


