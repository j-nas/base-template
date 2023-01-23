import { z } from 'zod';
import { createTRPCRouter, publicProcedure, editorProcedure } from '../trpc';
export const heroRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.hero.findMany();
  }
  ),
  getCurrent: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.middleHero.findFirst({
      where: {
        inUse: true,
      },
    });


  }
  ),
  create: editorProcedure
    .input(z.object({
      title: z.string(),
      imageUrl: z.string(),
      insetImageUrl: z.string(),
      subtitle: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.middleHero.create({
        data: {
          title: input.title,
          imageUrl: input.imageUrl,
          insetImageUrl: input.insetImageUrl,
          subtitle: input.subtitle,
        },
      });
    }
    ),
  edit: editorProcedure
    .input(z.object({
      id: z.string(),
      title: z.string(),
      imageUrl: z.string(),
      insetImageUrl: z.string(),
      subtitle: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.middleHero.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          imageUrl: input.imageUrl,
          insetImageUrl: input.insetImageUrl,
          subtitle: input.subtitle,
        },
      });
    }
    ),
  delete: editorProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.middleHero.delete({
        where: {
          id: input.id,
        },
      });
    }
    ),
  setInUse: editorProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction([
        ctx.prisma.middleHero.updateMany({
          where: {
            inUse: true,
          },
          data: {
            inUse: false,
          },
        }),
        ctx.prisma.middleHero.update({
          where: {
            id: input.id,
          },
          data: {
            inUse: true,
          },
        }),
      ])
    }
    ),
});


