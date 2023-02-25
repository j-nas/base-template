import { z } from 'zod';
import { createTRPCRouter, publicProcedure, editorProcedure } from '../trpc';

const testimonialSchema = z.object({
  id: z.string(),
  name: z.string(),
  quote: z.string(),
  title: z.string(),
  highlighted: z.boolean(),
  AvatarImage: z.array(z.object({
    id: z.string(),
    image: z.object({
      id: z.string(),
      height: z.number(),
      width: z.number(),
      public_Id: z.string(),
      format: z.string(),
    }),
  })).optional(),
});

export const testimonialRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.testimonial.findMany({
      include: {
        AvatarImage: {
          include: {
            image: true,
          }
        }
      },
    });
  }
  ),
  create: editorProcedure
    .input(z.object({
      name: z.string(),
      quote: z.string(),
      avatarImage: z.string(),
      title: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.testimonial.create({
        data: {
          name: input.name,
          quote: input.quote,
          AvatarImage: {
            create: {
              imageId: input.avatarImage
            }
          }
          ,
          title: input.title,
        },
      });
    }
    ),
  edit: editorProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
      quote: z.string(),
      avatarImage: z.string(),
      title: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.testimonial.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          quote: input.quote,
          AvatarImage: {
            create: {
              imageId: input.avatarImage
            }
          },
          title: input.title,
        },
      });
    }
    ),
  delete: editorProcedure
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
  toggleHighlight: editorProcedure
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
    .output(z.array(z.object({
      id: z.string(),
      name: z.string(),
      quote: z.string(),
      title: z.string(),
      highlighted: z.boolean(),
      AvatarImage: z.array(z.object({
        id: z.string(),
        image: z.object({
          id: z.string(),
          height: z.number(),
          width: z.number(),
          public_Id: z.string(),
          format: z.string(),
        }),
      })).optional(),
    })))
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.testimonial.findMany({
        where: {
          highlighted: true,
        },
        include: {
          AvatarImage: {
            include: {
              image: true,
            }
          }
        },
        take: 2,
      });

      return data
    }
    ),


});
