import { z } from 'zod';
import { createTRPCRouter, publicProcedure, adminProcedure } from '../trpc';

const testimonialSchema = z.object({
  id: z.string(),
  name: z.string(),
  quote: z.string(),
  title: z.string(),
  company: z.string(),
  highlighted: z.boolean(),
  createdAt: z.number(),

  image: z.object({
    id: z.string(),
    height: z.number(),
    width: z.number(),
    public_id: z.string(),
    format: z.string(),
  }).nullable(),
});



export const testimonialRouter = createTRPCRouter({
  getAll: publicProcedure
    .output(z.array(testimonialSchema))
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.testimonial.findMany({
        include: {
          avatarImage: {
            select: {
              image: true,
            }
          }
        },
      });

      return data.map((item) => {
        return {
          ...item,
          image: item.avatarImage?.image || null,
          createdAt: item.createdAt.valueOf(),
        }
      }
      )

    }
    ),
  getById: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .output(testimonialSchema)
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.testimonial.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          avatarImage: {
            select: {
              image: true,
            }
          }
        },
      });

      return {
        ...data,
        image: data?.avatarImage?.image || null,
        createdAt: data.createdAt.valueOf(),
      }
    }
    ),

  getByAvatarImageId: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.testimonial.findMany({
        where: {
          avatarImage: {
            imageId: input.id,
          }
        },

      })

      return data;
    }
    ),

  create: adminProcedure
    .input(z.object({
      name: z.string(),
      quote: z.string(),
      title: z.string(),
      company: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.testimonial.create({
        data: {
          ...input,
          highlighted: false,
        },
      });
    }
    ),

  update: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
      quote: z.string(),
      title: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.testimonial.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
    }
    ),
  updateAvatar: adminProcedure
    .input(z.object({
      id: z.string(),
      avatarImage: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const testimonial = await ctx.prisma.testimonial.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          avatarImage: true,
        }
      });

      if (input.avatarImage === "" && !testimonial.avatarImage) return testimonial;

      if (input.avatarImage === "" && testimonial.avatarImage) {
        return ctx.prisma.testimonial.update({
          where: {
            id: input.id,
          },
          data: {
            avatarImage: {
              delete: true,
            }
          },
        });
      }

      if (!testimonial.avatarImage) {
        return ctx.prisma.testimonial.update({
          where: {
            id: input.id,
          },
          data: {
            avatarImage: {
              create: {
                image: {
                  connect: {
                    public_id: input.avatarImage,
                  }
                }
              }
            }
          },
        });
      }

      return ctx.prisma.testimonial.update({
        where: {
          id: input.id,
        },
        data: {
          avatarImage: {
            update: {
              image: {
                connect: {
                  public_id: input.avatarImage,
                }
              }
            }
          }
        },
      });
    }
    ),

  delete: adminProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.testimonial.delete({
        where: {
          id: input.id,
        },
      });
    }
    ),
  toggleHighlight: adminProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const selected = await ctx.prisma.testimonial.findUniqueOrThrow({
        where: {
          id: input.id,
        },

      });


      return ctx.prisma.testimonial.update({
        where: {
          id: input.id,
        },
        data: {
          highlighted: !selected.highlighted,
        },
      });


    }
    ),
  getFirstTwoHighlighted: publicProcedure
    .output(z.array(testimonialSchema))
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.testimonial.findMany({
        where: {
          highlighted: true,
        },
        include: {
          avatarImage: {
            select: {
              image: true,
            }
          }
        },
        take: 2,
      });

      return data.map((item) => {
        return {
          ...item,
          image: item.avatarImage?.image || null,
          createdAt: item.createdAt.valueOf(),
        }
      }
      )
    }
    ),


});
