import { createTRPCRouter, adminProcedure, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import cloudinary, { type ConfigOptions } from "cloudinary";
import { env } from "../../../env/server.mjs";
import
getBase64ImageUrl from "../../../utils/generateBlurPlaceholder";

const cloudinaryConfig: ConfigOptions = {
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
};


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



  getImageById: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.image.findUniqueOrThrow({
        where: {
          id: input.id,
        },


      });

      return data;
    }
    ),
  deleteImage: adminProcedure
    .input(z.object({

      public_id: z.string(),
    }),
    )
    .mutation(async ({ ctx, input }) => {

      const fullPath = env.NEXT_PUBLIC_CLOUDINARY_FOLDER + "/" + input.public_id;
      console.log({ fullPath })
      cloudinary.v2.config(cloudinaryConfig);

      const result = await cloudinary.v2.uploader.destroy(fullPath, { invalidate: true, resource_type: "image", });
      console.log(result)
      if (result.result !== "ok") {
        throw new Error("Image deletion failed");
      }
      const data = await ctx.prisma.image.delete({
        where: {
          public_id: input.public_id,
        },
      });
      return data;

    }
    ),

  uploadImage: protectedProcedure
    .input(z.object({
      file: z.string(),
      public_id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {

      cloudinary.v2.config(cloudinaryConfig);
      const result = await cloudinary.v2.uploader.upload(input.file, {
        public_id: env.NEXT_PUBLIC_CLOUDINARY_FOLDER + "/" + input.public_id,
        overwrite: false,
        invalidate: true,
        resource_type: "image",

      });
      console.log({ result })
      const blurData = await getBase64ImageUrl(result.public_id, result.format);
      const data = await ctx.prisma.image.create({
        data: {
          type: result.resource_type,
          id: result.asset_id,
          blur_url: blurData,
          public_id: input.public_id,
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

  renameImage: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
      public_id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      cloudinary.v2.config(cloudinaryConfig);
      try {
        const oldPublicId = env.NEXT_PUBLIC_CLOUDINARY_FOLDER + "/" + input.public_id;
        const newPublicId = env.NEXT_PUBLIC_CLOUDINARY_FOLDER + "/" + input.name;
        const rename = await cloudinary.v2.uploader.rename(oldPublicId, newPublicId, { invalidate: true, }, function (error, result) {
          console.log(result, error)
        });
        const data = await ctx.prisma.image.update({
          where: {
            id: input.id,
          },
          data: {
            public_id: rename.public_id.split("/")[1],
            secure_url: rename.secure_url,
          },
        });
        return data;
      } catch (error) {
        console.log(error);
      }

    }
    ),
  getAllImages: publicProcedure

    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.image.findMany({
        include: {
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

      const shaped = data.map((item) => {

        const userAvatars = item.avatarImage?.map((item) => {


          return {
            name: item.user?.name,
            id: item.user?.id,
          }
        }).filter((item) => item.id !== undefined);
        const testimonialAvatars = item.avatarImage?.map((item) => {
          return {
            name: item.testimonial?.name,
            id: item.testimonial?.id,
          }
        }).filter((item) => item.id !== undefined);
        const servicePrimaryImages = item.primaryImage?.map((item) => {
          return {
            title: item.service?.title,
            id: item.service?.id,
            position: item.service?.position,
          }
        }).filter((item) => item.id !== undefined);
        const serviceSecondaryImages = item.secondaryImage?.map((item) => {
          return {
            title: item.service?.title,
            id: item.service?.id,
            position: item.service?.position,
          }
        }).filter((item) => item.id !== undefined);
        const aboutPrimaryImages = item.primaryImage?.map((item) => {
          return {
            id: item.aboutUs?.id,
          }
        }).filter((item) => item.id !== undefined);
        const aboutSecondaryImages = item.secondaryImage?.map((item) => {
          return {
            id: item.aboutUs?.id,
          }
        }).filter((item) => item.id !== undefined);
        const blogPrimaryImages = item.primaryImage?.map((item) => {
          return {
            title: item.blog?.title,
            id: item.blog?.id,
          }
        }).filter((item) => item.id !== undefined);
        const heroPrimaryImages = item.primaryImage?.map((item) => {
          return {
            id: item.hero?.id,
            position: item.hero?.position,
          }
        }).filter((item) => item.id !== undefined);
        const galleryImages = item.imageForGallery?.map((item) => {
          return {
            gallery: item.gallery?.position,
          }
        }).filter((item) => item.gallery !== undefined);

        return {
          ...item,
          inUseProps: {

            userAvatars,
            testimonialAvatars,
            servicePrimaryImages,
            serviceSecondaryImages,
            aboutPrimaryImages,
            aboutSecondaryImages,
            blogPrimaryImages,
            heroPrimaryImages,
            galleryImages,
          }
        };
      });



      return shaped



    }
    ),
});