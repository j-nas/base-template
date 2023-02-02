import { z } from "zod";
import { createTRPCRouter, publicProcedure, editorProcedure } from "../trpc";
import { Services } from "@prisma/client";

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
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.service.findUnique({
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
            },
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
            },
          },
        },
      });
    }
    ),
  getActive: publicProcedure
    .output(z.object({
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
    }).array())
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


