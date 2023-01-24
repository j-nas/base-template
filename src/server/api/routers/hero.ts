import { z } from "zod";
import { createTRPCRouter, publicProcedure, editorProcedure } from "../trpc";
import { exclude } from "../../../utils/exclude";


export const heroRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.hero.findMany();
  }
  ),
  getTop: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.hero.findUniqueOrThrow({
      where: {
        position: "TOP",
      },
    });
    return exclude(data, ["createdAt"]);

  }
  ),
  getBottom: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.hero.findUniqueOrThrow({
      where: {
        position: "BOTTOM",
      },
    });

    return exclude(data, ["createdAt",]);

  }
  ),
  create: editorProcedure
    .input(z.object({
      title: z.string(),
      subtitle: z.string(),
      image: z.string(),
      description: z.string(),

    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.hero.create({
        data: {
          title: input.title,
          subtitle: input.subtitle,
          image: input.image,
          description: input.description,
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
