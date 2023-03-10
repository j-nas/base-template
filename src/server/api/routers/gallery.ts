import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const galleryRouter = createTRPCRouter({
  getFrontPageGallery: publicProcedure
    .output(z.object({
      id: z.string(),
      format: z.string(),
      height: z.number(),
      width: z.number(),
      public_Id: z.string(),
      blur_url: z.string(),
      altText: z.string(),
    }).array())
    .query(async ({ ctx }) => {
      const images = await ctx.prisma.image.findMany({
        where: {
          imageForGallery: {
            some: {
              gallery: {
                position: "FRONT"
              }
            }
          }
        },
      });



      const img = images.map(async (image) => {
        return {
          ...image,
          ...await ctx.prisma.imageForGallery.findFirstOrThrow({
            where: {
              imageId: image.id,
            },
            select: {
              altText: true,
            },
          }),
        };
      });
      return await Promise.all(img);
    }
    ),
  getMainGallery: publicProcedure
    .output(z.object({
      id: z.string(),
      format: z.string(),
      height: z.number(),
      width: z.number(),
      public_Id: z.string(),
      blur_url: z.string(),
      altText: z.string(),
      index: z.number(),
    }).array())
    .query(async ({ ctx }) => {
      const images = await ctx.prisma.image.findMany({
        where: {
          imageForGallery: {
            some: {
              gallery: {
                position: "MAIN"
              }
            }
          }
        },
      });
      return await Promise.all(images.map(async (image, index) => {
        return {
          ...image,
          ...await ctx.prisma.imageForGallery.findFirstOrThrow({
            where: {
              imageId: image.id,
            },
            select: {
              altText: true,
            },
          }),
          index,
        }
      }));
    }),
});
