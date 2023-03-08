import { createTRPCRouter, editorProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import cloudinary, { type ConfigOptions } from "cloudinary";
import { env } from "../../../env/server.mjs";
import
getBase64ImageUrl from "../../../utils/generateBlurPlaceholder";


export const imageRouter = createTRPCRouter({
  getTotalSize: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.image.aggregate({
      _sum: {
        bytes: true,
      }
    });

    return data;
  }
  ),
  getAllImages: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.image.findMany({
      include: {
        imageForGallery: true,
        avatarImage: true,
        primaryImage: true,
        businessLogo: true,
        secondaryImage: true,

      },


    });

    return data;
  }
  ),
  getImageById: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.image.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          imageForGallery: true,
          avatarImage: true,
          primaryImage: true,
          businessLogo: true,
          secondaryImage: true,

        },

      });

      return data;
    }
    ),
  uploadImage: editorProcedure
    .input(z.object({
      file: z.string(),
      name: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const cloudinaryConfig: ConfigOptions = {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      };
      cloudinary.v2.config(cloudinaryConfig);
      const result = await cloudinary.v2.uploader.upload(input.file, {
        public_id: env.NEXT_PUBLIC_CLOUDINARY_FOLDER + "/" + input.name,
        overwrite: true,
        invalidate: true,
        resource_type: "image",
      });
      const blurData = await getBase64ImageUrl(result.public_id, result.format);
      const data = await ctx.prisma.image.create({
        data: {
          type: result.resource_type,
          id: result.asset_id,
          blur_url: blurData,
          public_Id: result.public_id,
          bytes: result.bytes,
          format: result.format,
          height: result.height,
          width: result.width,
          secure_url: result.secure_url,
        }
      });

      return data;
    }
    ),

  renameImage: editorProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.image.update({
        where: {
          id: input.id,
        },
        data: {
          public_Id: input.name,
        },
      });

      return data;
    }
    ),
  imageInUseBy: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.image.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        select: {
          imageForGallery: {
            select: {
              gallery: {
                select: {
                  position: true,
                  id: true,
                }
              }
            }
          },
          avatarImage: {
            select: {
              testimonial: {
                select: {
                  name: true,
                  id: true,
                }
              },
              user: {
                select: {
                  name: true,
                  id: true,
                }
              },
            }
          },
          primaryImage: {
            select: {
              service: {
                select: {
                  title: true,
                  id: true,
                  position: true,
                }
              },
              blog: {
                select: {
                  title: true,
                  id: true,
                }
              },
              hero: {
                select: {
                  id: true,
                  position: true,
                }
              },
              aboutUs: {
                select: {
                  id: true,
                }
              },
            }
          },
          secondaryImage: {
            select: {
              service: {
                select: {
                  title: true,
                  id: true,
                  position: true,
                }
              },
              aboutUs: {
                select: {
                  id: true,
                }
              },
            }
          },




        },

      });

      const userAvatars = data.avatarImage?.map((item) => {


        return {
          name: item.user?.name,
          id: item.user?.id,
        }
      }).filter((item) => item.id !== undefined);
      const testimonialAvatars = data.avatarImage?.map((item) => {
        return {
          name: item.testimonial?.name,
          id: item.testimonial?.id,
        }
      }).filter((item) => item.id !== undefined);
      const servicePrimaryImages = data.primaryImage?.map((item) => {
        return {
          title: item.service?.title,
          id: item.service?.id,
          position: item.service?.position,
        }
      }).filter((item) => item.id !== undefined);
      const serviceSecondaryImages = data.secondaryImage?.map((item) => {
        return {
          title: item.service?.title,
          id: item.service?.id,
          position: item.service?.position,
        }
      }).filter((item) => item.id !== undefined);
      const aboutPrimaryImages = data.primaryImage?.map((item) => {
        return {
          id: item.aboutUs?.id,
        }
      }).filter((item) => item.id !== undefined);
      const aboutSecondaryImages = data.secondaryImage?.map((item) => {
        return {
          id: item.aboutUs?.id,
        }
      }).filter((item) => item.id !== undefined);
      const blogPrimaryImages = data.primaryImage?.map((item) => {
        return {
          title: item.blog?.title,
          id: item.blog?.id,
        }
      }).filter((item) => item.id !== undefined);
      const heroPrimaryImages = data.primaryImage?.map((item) => {
        return {
          id: item.hero?.id,
          position: item.hero?.position,
        }
      }).filter((item) => item.id !== undefined);
      const galleryImages = data.imageForGallery?.map((item) => {
        return {
          gallery: item.gallery?.position,
        }
      }).filter((item) => item.gallery !== undefined);

      return {
        userAvatars,
        testimonialAvatars,
        servicePrimaryImages,
        serviceSecondaryImages,
        aboutPrimaryImages,
        aboutSecondaryImages,
        blogPrimaryImages,
        heroPrimaryImages,
        galleryImages,
      };


    }
    ),
});