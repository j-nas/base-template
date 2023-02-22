import { z } from "zod";
import { createTRPCRouter, publicProcedure, editorProcedure } from "../trpc";
import { Services } from "@prisma/client";
import { exclude } from "../../../utils/exclude";

const serviceSchema = z.object({
  id: z.string(),
  pageName: z.string(),
  title: z.string(),
  shortDescription: z.string(),
  markdown: z.string(),
  icon: z.string(),
  position: z.nativeEnum(Services).nullable(),

  PrimaryImage: z.object({
    id: z.string(),
    height: z.number(),
    width: z.number(),
    public_Id: z.string(),
    format: z.string(),
    blur_url: z.string(),
  }),

  SecondaryImage: z.object({
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
        PrimaryImage: {
          select: {
            image: true,
          }
        },
        SecondaryImage: {
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
          PrimaryImage: {
            some: {
              serviceId: data.id,
            }
          }
        },
      });
      const secondaryImage = await ctx.prisma.image.findFirstOrThrow({
        where: {
          SecondaryImage: {
            some: {
              serviceId: data.id,
            }
          }
        },
      });

      return { ...data, PrimaryImage: primaryImage, SecondaryImage: secondaryImage }

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
          PrimaryImage: await ctx.prisma.image.findFirstOrThrow({
            where: {
              PrimaryImage: {
                some: {
                  serviceId: service.id,
                }
              }
            }
          }),
          SecondaryImage: await ctx.prisma.image.findFirstOrThrow({
            where: {
              SecondaryImage: {
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
          PrimaryImage: {
            select: {
              image: true,

            },
            take: 1,

          },
          SecondaryImage: {
            select: {
              image: true,
            },
            take: 1
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


