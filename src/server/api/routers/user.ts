import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
  superAdminProcedure,
} from "../trpc";
import { exclude } from "../../../utils/exclude";

export const userRouter = createTRPCRouter({
  // getAll
  getAll: adminProcedure
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.user.findMany({
        include: {
          avatarImage: {
            select: {
              image: {
                select: {
                  public_id: true,
                }
              }
            }
          },
          Blog: {
            select: {
              id: true,
              title: true,
            }
          }
        }
      });

      return data.map((user) => ({ ...user, avatarImage: user?.avatarImage?.image.public_id }));

    }),
  // getById
  getById: adminProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
        include: {
          avatarImage: {
            select: {
              image: {
                select: {
                  public_id: true,
                  blur_url: true,
                }
              }
            }
          },
          Blog: {
            select: {
              id: true,
              title: true,
            }
          }
        }
      });

      return {
        ...data,
        avatarImage: {
          public_id: data?.avatarImage?.image?.public_id,
          blur_url: data?.avatarImage?.image?.blur_url
        }
      };

    }),

  // getSelf
  getSelf: protectedProcedure
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          avatarImage: {
            select: {
              image: {
                select: {
                  public_id: true,
                }
              }
            }
          },
          Blog: {
            select: {
              id: true,
              title: true,
            }
          }
        }
      });

      return { ...data, avatarImage: data?.avatarImage?.image.public_id };
    }),

  // create
  create: superAdminProcedure
    .input(z.object({
      name: z.string(),
      email: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.user.create({
        data: {
          ...input,

        },
      });
      return data;
    }),
  // update
  update: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      avatarImage: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (input.avatarImage === "") {
        return await ctx.prisma.user.update({
          where: {
            id: input.id,
          },
          data: {
            ...exclude(input, ["id", "avatarImage"]),
            avatarImage: {
              delete: true,
            }
          },
        });
      }
      const data = await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          ...exclude(input, ["id"]),
          avatarImage: {
            delete: true,
            create: {
              image: {
                connect: {
                  public_id: input.avatarImage,
                }
              }
            }
          }
        },
      });


      return data;
    }),

  // updateSelf
  updateSelf: protectedProcedure
    .input(z.object({
      name: z.string(),
      email: z.string(),
      avatarImageId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          ...input,
          avatarImage: {
            create: {
              image: {
                connect: {
                  public_id: input.avatarImageId,
                }
              }
            }
          }
        },
      });
      return data;
    }),


  // delete
  delete: superAdminProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.user.delete({

        where: {
          id: input.id,

        },


      });
      return data;
    }),

  // toggleAdmin
  toggleAdmin: superAdminProcedure
    .input(z.object({
      id: z.string(),
      admin: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          admin: input.admin,
        },
      });

      await prisma?.session.deleteMany({
        where: {
          userId: input.id,
        },
      });

      return data;
    }),

});