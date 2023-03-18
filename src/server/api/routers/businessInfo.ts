import { z } from "zod";
import { createTRPCRouter, publicProcedure, adminProcedure } from "../trpc";
import { exclude } from "../../../utils/exclude";

export const businessProfileValidation = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "Business name required" }),
  address: z.string().min(1),
  city: z.string().min(1),
  province: z.string().min(1),
  postalCode: z.string().min(1),
  telephone: z.string().min(1, { message: "Phone number required" }),
  email: z.string().email().min(1, { message: "Email is required" }),
  holidays: z.string(),
  hours: z.string(),
  ownerName: z.string(),
  ownerTitle: z.string(),
  ownerQuote: z.string(),
  facebookUrl: z.string().nullish(),
  instagramUrl: z.string().nullish(),
  twitterUrl: z.string().nullish(),
  youtubeUrl: z.string().nullish(),
  linkedInUrl: z.string().nullish(),
  pinterestUrl: z.string().nullish(),
  tiktokUrl: z.string().nullish(),
  snapchatUrl: z.string().nullish(),
  whatsappUrl: z.string().nullish(),
});



export const businessInfoRouter = createTRPCRouter({

  getActive: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.businessInfo.findFirstOrThrow({
      where: {
        isActive: true,
      }
    });

    return exclude(data, ["createdAt", "updatedAt"]);

  }),
  getActiveWithDateTime: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.businessInfo.findFirstOrThrow({
      where: {
        isActive: true,
      }
    });

    return data;

  }),

  update: adminProcedure
    .input(businessProfileValidation)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.businessInfo.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          address: input.address,
          city: input.city,
          province: input.province,
          postalCode: input.postalCode,
          telephone: input.telephone,
          email: input.email,
          ownerName: input.ownerName,
          ownerTitle: input.ownerTitle,
          ownerQuote: input.ownerQuote,
          facebookUrl: input.facebookUrl,
          instagramUrl: input.instagramUrl,
          twitterUrl: input.twitterUrl,
          youtubeUrl: input.youtubeUrl,
          linkedInUrl: input.linkedInUrl,
          pinterestUrl: input.pinterestUrl,
          tiktokUrl: input.tiktokUrl,
          snapchatUrl: input.snapchatUrl,
          whatsappUrl: input.whatsappUrl,



        },
      });
    }
    ),



});

