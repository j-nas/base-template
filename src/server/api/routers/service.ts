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
    public_Id: z.string(),
    format: z.string(),
    blur_url: z.string(),
  }),

  secondaryImage: z.object({
    id: z.string(),
    height: z.number(),
    width: z.number(),
    public_Id: z.string(),
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
    .input(z.object({ position: z.nativeEnum(Services) }))
    .query(({ ctx, input }) => {
      return ctx.prisma.service.findUnique({
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
    }

    ),

  removePosition: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.service.update({
        where: {
          id: input.id,
        },
        data: {
          position: null,
        },
      });
    }
    ),
  create: editorProcedure
    .input(z.object({
      title: z.string(),
      markdown: z.string(),
      primaryImage: z.string(),
      secondaryImage: z.string(),
      shortDescription: z.string(),
      icon: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.service.create({
        data: {
          title: input.title,
          markdown: input.markdown,
          shortDescription: input.shortDescription,
          icon: input.icon,
          pageName: input.title.toLowerCase().replace(/ /g, "-"),
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
    }
    ),
  edit: editorProcedure
    .input(z.object({
      id: z.string(),
      title: z.string(),
      markdown: z.string(),
      primaryImage: z.string(),
      secondaryImage: z.string(),
      shortDescription: z.string(),
      icon: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.service.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          markdown: input.markdown,
          shortDescription: input.shortDescription,
          icon: input.icon,
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
    }
    ),
  assignPosition: editorProcedure
    .input(z.object({
      id: z.string(),
      position: z.nativeEnum(Services),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction([
        ctx.prisma.service.update({
          where: {
            position: input.position,
          },
          data: {
            position: null,
          },
        }),
        ctx.prisma.service.update({
          where: {
            id: input.id,
          },
          data: {
            position: input.position,
          },
        }),
      ]);

    }
    ),

});


