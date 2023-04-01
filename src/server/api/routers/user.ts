import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
  superAdminProcedure,
} from "../trpc";
import { exclude } from "../../../utils/exclude";
import { prisma } from "../../db";

const userGet = async (id: string) => {

  const data = await prisma.user.findUniqueOrThrow({
    where: {
      id: id
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
          createdAt: true,
          updatedAt: true,
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

}

const userUpdateSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatarImage: z.string().optional(),
  avatarImageExists: z.boolean().optional(),
});

const userUpdate = async (input: z.infer<typeof userUpdateSchema>) => {
  if (input.avatarImage === "" && !input.avatarImageExists) {
    return await prisma.user.update({
      where: {
        id: input.id,
      },
      data: {
        ...exclude(input, ["id", "avatarImage", "avatarImageExists"]),
      },
    });
  }

  if (input.avatarImage === "" && input.avatarImageExists) {
    return await prisma.user.update({
      where: {
        id: input.id,
      },
      data: {
        ...exclude(input, ["id", "avatarImage", "avatarImageExists"]),
        avatarImage: {
          delete: true,
        },
      },
    });
  }
  if (!input.avatarImageExists) {
    return await prisma.user.update({
      where: {
        id: input.id,
      },
      data: {
        ...exclude(input, ["id", "avatarImageExists"]),
        avatarImage: {
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
  }

  return await prisma.user.update({
    where: {
      id: input.id,
    },
    data: {
      ...exclude(input, ["id", "avatarImageExists"]),
      avatarImage: {
        update: {
          image: {
            connect: {
              public_id: input.avatarImage,
            }
          }
        }
      }
    },
  });

}


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
    .query(async ({ input }) => {
      return userGet(input.id)
    }),

  // getSelf
  getSelf: protectedProcedure
    .query(async ({ ctx }) => {
      return userGet(ctx.session.user.id)
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
  update: superAdminProcedure
    .input(userUpdateSchema)
    .mutation(async ({ input }) => {

      return userUpdate(input);
    }),

  // updateSelf
  updateSelf: protectedProcedure

    .input(userUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return userUpdate({ ...input, id: ctx.session.user.id });
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