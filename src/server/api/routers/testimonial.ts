import { z } from 'zod';
import { createTRPCRouter, publicProcedure, editorProcedure } from '../trpc';

export const testimonialRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.testimonial.findMany();
  }
  ),
  create: editorProcedure
    .input(z.object({
      name: z.string(),
      quote: z.string(),
      avatarUrl: z.string(),
      title: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.testimonial.create({
        data: {
          name: input.name,
          quote: input.quote,
          avatarUrl: input.avatarUrl,
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
      avatarUrl: z.string(),
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
          avatarUrl: input.avatarUrl,
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
  getFirstTwoHighlighted: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.testimonial.findMany({
      where: {
        highlighted: true,
      },
      take: 2,
    });
  }
  ),


});
