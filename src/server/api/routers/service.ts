import { z } from "zod";
import { createTRPCRouter, publicProcedure, editorProcedure } from "../trpc";
import { Services } from "@prisma/client";

export const serviceRouter = createTRPCRouter({

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.service.findMany();
  }
  ),
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.service.findUnique({
        where: {
          id: input.id,
        },
      });
    }
    ),
  getByPosition: publicProcedure
    .input(z.object({ position: z.nativeEnum(Services) }))
    .query(({ ctx, input }) => {
      return ctx.prisma.service.findUnique({
        where: {
          position: input.position,
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
      summary: z.string(),
      longForm: z.string(),
      imageUrl: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.service.create({
        data: {
          title: input.title,
          summary: input.summary,
          longForm: input.longForm,
          imageUrl: input.imageUrl,
        },
      });
    }
    ),
  edit: editorProcedure
    .input(z.object({
      id: z.string(),
      title: z.string(),
      summary: z.string(),
      longForm: z.string(),
      imageUrl: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.service.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          summary: input.summary,
          longForm: input.longForm,
          imageUrl: input.imageUrl,
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


