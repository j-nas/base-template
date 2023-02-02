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
          ImageForGallery: {
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
});
