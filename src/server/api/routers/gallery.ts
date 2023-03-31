import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { GalleryPosition } from "@prisma/client";

export const galleryRouter = createTRPCRouter({
  getFrontPageGallery: publicProcedure
    .output(z.object({
      id: z.string(),
      format: z.string(),
      height: z.number(),
      width: z.number(),
      public_id: z.string(),
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
      public_id: z.string(),
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

        include: {
          imageForGallery: {
            select: {
              altText: true,
            }
          }
        }
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
  getByPosition: publicProcedure
    .input(z.object({
      position: z.nativeEnum(GalleryPosition),
    }))

    .query(async ({ ctx, input }) => {
      const gallery = await ctx.prisma.imageForGallery.findMany({
        where: {
          position: input.position,
        },
        include: {
          image: true,

        },
      });
      return gallery.map((image) => {
        return {
          ...image.image,
          altText: image.altText,
          index: image.index,
        };
      });
    }
    ),
  addImage: adminProcedure
    .input(z.object({
      id: z.string(),
      position: z.nativeEnum(GalleryPosition),
      index: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.imageForGallery.create({
        data: {
          index: input.index,
          image: {
            connect: {
              public_id: input.id,
            },

          },
          gallery: {
            connect: {
              position: input.position,
            },
          },
          altText: "Enter a description of the image.",
        },
      });
    }),
  removeImage: adminProcedure
    .input(z.object({
      id: z.string(),
      position: z.nativeEnum(GalleryPosition),
    }))
    .mutation(async ({ ctx, input }) => {

      return await ctx.prisma.imageForGallery.delete({
        where: {
          imageId_position: {
            imageId: input.id,
            position: input.position,
          },
        },
      });

    }),
  updateAltText: adminProcedure
    .input(z.object({
      id: z.string(),
      position: z.nativeEnum(GalleryPosition),
      altText: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.imageForGallery.update({
        where: {
          imageId_position: {
            imageId: input.id,
            position: input.position,
          },
        },
        data: {
          altText: input.altText,
        },
      });
    }),
  swapIndex: adminProcedure
    .input(z.object({
      id: z.string(),
      position: z.nativeEnum(GalleryPosition),
      oldIndex: z.number(),
      newIndex: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.imageForGallery.updateMany({
        where: {
          position: input.position,
          index: input.newIndex
        },
        data: {
          index: input.oldIndex,
        },
      });
      return await ctx.prisma.imageForGallery.update({
        where: {
          imageId_position: {
            imageId: input.id,
            position: input.position,
          },
        },
        data: {
          index: input.newIndex,
        },
      });
    }),
});
