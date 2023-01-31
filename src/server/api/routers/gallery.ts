import { createTRPCRouter, publicProcedure } from "../trpc";

export const galleryRouter = createTRPCRouter({
  findFirst: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.gallery.findFirstOrThrow({
      include: {
        ImageForGallery: true,
      },
    });
  }
  ),
});
