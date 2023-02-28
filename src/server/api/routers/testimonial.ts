import { z } from 'zod';
import { createTRPCRouter, publicProcedure, editorProcedure } from '../trpc';

const testimonialSchema = z.object({
  id: z.string(),
  name: z.string(),
  quote: z.string(),
  title: z.string(),
  company: z.string(),
  highlighted: z.boolean(),

  image: z.object({
    id: z.string(),
    height: z.number(),
    width: z.number(),
    public_Id: z.string(),
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
        }
      }
      )

    }
    ),
  getOne: publicProcedure
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
      }
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
          avatarImage: {
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
        }
      }
      )
    }
    ),


});
