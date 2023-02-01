import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { GalleryPosition } from "@prisma/client";

export const galleryRouter = createTRPCRouter({
  findFirst: publicProcedure
    .output(z.object({
      id: z.string(),
      name: z.string(),
      position: z.nativeEnum(GalleryPosition).nullable(),
      ImageForGallery: z.array(z.object({
        image: z.object({
          id: z.string(),
          format: z.string(),
          height: z.number(),
          width: z.number(),
          public_Id: z.string(),
        }),
      })),
    }))
    .query(({ ctx }) => {
      return ctx.prisma.gallery.findFirstOrThrow({
        include: {
          ImageForGallery: {
            include: {
              image: true,
            },
          }
        },
      });

    }
    ),
});
