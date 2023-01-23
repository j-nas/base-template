import { z } from "zod";
import { createTRPCRouter, publicProcedure, editorProcedure } from "../trpc";



export const heroRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.hero.findMany();
  }
  ),
  getTop: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.hero.findUnique({
      where: {
        position: "TOP",
      },
    });

  }
  ),
  getBottom: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.hero.findUnique({
      where: {
        position: "BOTTOM",
      },
    });

  }
  ),
  create: editorProcedure
    .input(z.object({
      title: z.string(),
      subtitle: z.string(),
      image: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.hero.create({
        data: {
          title: input.title,
          subtitle: input.subtitle,
          image: input.image,
        },
      });
    }
    ),
  edit: editorProcedure
    .input(z.object({
      id: z.string(),
      title: z.string(),
      subtitle: z.string(),
      image: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.hero.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          subtitle: input.subtitle,
          image: input.image,
        },
      });
    }
    ),
  delete: editorProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.hero.delete({
        where: {
          id: input.id,
        },
      });
    }
    ),
  setTop: editorProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction([
        ctx.prisma.hero.update({
          where: {
            position: "TOP",
          },
          data: {
            position: undefined,
          },
        }),
        ctx.prisma.hero.update({
          where: {
            id: input.id,
          },
          data: {
            position: "TOP",
          },
        }),
      ]);
    }
    ),
  setBottom: editorProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction([
        ctx.prisma.hero.update({
          where: {
            position: "BOTTOM",
          },
          data: {
            position: undefined,
          },
        }),
        ctx.prisma.hero.update({
          where: {
            id: input.id,
          },
          data: {
            position: "BOTTOM",
          },
        }),
      ]);
    }
    ),
});
