import { z } from "zod";
import { createTRPCRouter, publicProcedure, editorProcedure } from "../trpc";

export const businessInfoRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.businessInfo.findMany();
  }),
  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.businessInfo.findFirst({
      orderBy: {
        updatedAt: "desc"
      }
    });
  }),
  create: editorProcedure
    .input(z.object({
      title: z.string(),
      addressFirstLine: z.string(),
      addressSecondLine: z.string(),
      telephone: z.string(),
      email: z.string().email(),
      ownerName: z.string(),
      ownerTitle: z.string(),
      ownerQuote: z.string(),
      facebookUrl: z.string().url().optional(),
      instagramUrl: z.string().url().optional(),
      twitterUrl: z.string().url().optional(),
      youtubeUrl: z.string().url().optional(),
      linkedinUrl: z.string().url().optional(),
      pinterestUrl: z.string().url().optional(),
      tiktokUrl: z.string().url().optional(),
      snapchatUrl: z.string().url().optional(),
      whatsappUrl: z.string().url().optional(),

    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.businessInfo.create({
        data: {
          title: input.title,
          addressFirstLine: input.addressFirstLine,
          addressSecondLine: input.addressSecondLine,
          telephone: input.telephone,
          email: input.email,
          ownerName: input.ownerName,
          ownerTitle: input.ownerTitle,
          ownerQuote: input.ownerQuote,
          facebookUrl: input.facebookUrl,
          instagramUrl: input.instagramUrl,
          twitterUrl: input.twitterUrl,
          youtubeUrl: input.youtubeUrl,
          linkedInUrl: input.linkedinUrl,
          pinterestUrl: input.pinterestUrl,
          tiktokUrl: input.tiktokUrl,
          snapchatUrl: input.snapchatUrl,
          whatsappUrl: input.whatsappUrl,
        },

      });
    }
    ),
  edit: editorProcedure
    .input(z.object({
      id: z.string(),
      title: z.string(),
      addressFirstLine: z.string(),
      addressSecondLine: z.string(),
      telephone: z.string(),
      email: z.string().email(),
      ownerName: z.string(),
      ownerTitle: z.string(),
      ownerQuote: z.string(),
      facebookUrl: z.string().url().optional(),
      instagramUrl: z.string().url().optional(),
      twitterUrl: z.string().url().optional(),
      youtubeUrl: z.string().url().optional(),
      linkedinUrl: z.string().url().optional(),
      pinterestUrl: z.string().url().optional(),
      tiktokUrl: z.string().url().optional(),
      snapchatUrl: z.string().url().optional(),
      whatsappUrl: z.string().url().optional(),

    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.businessInfo.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          addressFirstLine: input.addressFirstLine,
          addressSecondLine: input.addressSecondLine,
          telephone: input.telephone,
          email: input.email,
          ownerName: input.ownerName,
          ownerTitle: input.ownerTitle,
          ownerQuote: input.ownerQuote,
          facebookUrl: input.facebookUrl,
          instagramUrl: input.instagramUrl,
          twitterUrl: input.twitterUrl,
          youtubeUrl: input.youtubeUrl,
          linkedInUrl: input.linkedinUrl,
          pinterestUrl: input.pinterestUrl,
          tiktokUrl: input.tiktokUrl,
          snapchatUrl: input.snapchatUrl,
          whatsappUrl: input.whatsappUrl,
        },
      });
    }
    ),
  setInUse: editorProcedure
    .input(z.object({
      id: z.string(),
      inUse: z.boolean(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction([
        ctx.prisma.businessInfo.updateMany({

          data: {
            inUse: false,
          },
        }),
        ctx.prisma.businessInfo.update({
          where: {
            id: input.id,
          },
          data: {
            inUse: input.inUse,
          },
        }),
      ]);
    }
    ),
  delete: editorProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.businessInfo.delete({
        where: {
          id: input.id,
        },
      });
    }
    ),



});
