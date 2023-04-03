import { IoMdConstruct, IoMdTrash } from "react-icons/io";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import AvatarDisplay from "../AvatarDisplay";
import { api, type RouterOutputs } from "../../utils/api";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import ImageSelectDialog from "./dialogs/ImageSelectDialog";
import TestimonialDeleteDialog from "./dialogs/TestimonialDeleteDialog";
import TestimonialEditDialog from "./dialogs/TestimonialEditDialog";
import { type Testimonial } from "@prisma/client";
type Props = { testimonials: RouterOutputs["testimonial"]["getAll"] };

export default function BlogListing({ testimonials }: Props) {
  const { data: session, status } = useSession();
  const [parent] = useAutoAnimate();
  const ctx = api.useContext();
  const deleteMutation = api.testimonial.delete.useMutation();
  const featuredMutation = api.testimonial.toggleHighlight.useMutation();
  const avatarImageMutation = api.testimonial.updateAvatar.useMutation();
  const updateMutation = api.testimonial.update.useMutation();
  const createMutation = api.testimonial.create.useMutation();

  const handleTestimonialDelete = async (id: string) => {
    await toast.promise(
      deleteMutation.mutateAsync(
        { id },
        {
          onSuccess: async () => {
            await ctx.testimonial.invalidate();
            await ctx.testimonial.getAll.refetch();
          },
          onError: (error) => {
            console.log(error);
            toast.error(error.message);
          },
        }
      ),
      {
        loading: "Deleteing...",
        success: "Testimonial Deleted!",
        error: "Error",
      }
    );
  };

  const testimonialsWithAvatar = testimonials.filter(
    (testimonial) => testimonial.image
  );

  const handleTestimonialFeaturedToggle = async (id: string) => {
    await toast.promise(
      featuredMutation.mutateAsync(
        { id },
        {
          onSuccess: async () => {
            await ctx.testimonial.invalidate();
            await ctx.testimonial.getAll.refetch();
          },
          onError: (error) => {
            console.log(error);
            toast.error(error.message);
          },
        }
      ),
      {
        loading: "Updating...",
        success: "Blog Updated!",
        error: "Error",
      }
    );
  };

  const handleAvatarImageSelect = async (
    public_id: string,
    _position: string,
    id?: string
  ) => {
    if (!id) return;
    const avatarImageExists = testimonialsWithAvatar.find(
      (testimonial) => testimonial.image?.public_id === public_id
    )
      ? true
      : false;
    console.log(avatarImageExists);
    await toast.promise(
      avatarImageMutation.mutateAsync(
        { id, avatarImage: public_id },
        {
          onSuccess: async () => {
            await ctx.testimonial.invalidate();
            await ctx.testimonial.getAll.refetch();
          },
          onError: (error) => {
            console.log(error);
            toast.error(error.message);
          },
        }
      ),
      {
        loading: "Updating...",
        success: "Avatar Image Updated!",
        error: "Error",
      }
    );
  };

  const handleTestimonialCreate = async (
    data: Omit<Testimonial, "createdAt" | "highlighted">
  ) => {
    await toast.promise(
      createMutation.mutateAsync(data, {
        onSuccess: async () => {
          await ctx.testimonial.invalidate();
          await ctx.testimonial.getAll.refetch();
        },
        onError: (error) => {
          console.log(error);
          toast.error(error.message);
        },
      }),
      {
        loading: "Creating...",
        success: "Testimonial Created!",
        error: "Error",
      }
    );
  };

  const handleTestimonialUpdate = async (
    data: Omit<Testimonial, "createdAt" | "highlighted">
  ) => {
    await toast.promise(
      updateMutation.mutateAsync(data, {
        onSuccess: async () => {
          await ctx.testimonial.invalidate();
          await ctx.testimonial.getAll.refetch();
        },
        onError: (error) => {
          console.log(error);
          toast.error(error.message);
        },
      }),
      {
        loading: "Updating...",
        success: "Testimonial Updated!",
        error: "Error",
      }
    );
  };

  return (
    <div className="mt-4 flex flex-col gap-4 px-4 pb-12">
      <Toaster position="bottom-right" />
      {testimonials && (
        <div ref={parent} className="flex flex-col gap-4">
          <h2 className="font-black  text-xl">
            {testimonials?.length > 0 ? "Testimonials" : "No Testimonials"}
          </h2>

          {testimonials?.map((testimonial) => (
            <div
              key={testimonial.id}
              className="grid rounded-lg bg-base-300 p-4 pr-6 drop-shadow-2xl sm:grid-cols-7"
            >
              <div className="flex flex-col place-self-center">
                <ImageSelectDialog
                  handleImageChange={handleAvatarImageSelect}
                  position="avatar"
                  originId={testimonial.id}
                >
                  <div className="btn btn-outline btn-square h-fit w-fit">
                    <div className="transition-all hover:brightness-125">
                      <AvatarDisplay
                        public_id={testimonial.image?.public_id}
                        name={testimonial.name}
                        size={20}
                      />
                    </div>
                  </div>
                </ImageSelectDialog>
              </div>
              <div className="row-start-2 mx-4 flex w-5/6 flex-col flex-wrap place-self-center sm:col-span-5 sm:row-start-auto ">
                <span className="text-md font-medium">
                  <h3 className="mr-1 mb-1 text-lg">{testimonial.name}</h3>
                </span>
                <span className="font-thin text-sm">
                  <span className="font-bold">Quote:</span> {testimonial.quote}
                </span>

                <span className="font-thin text-sm">
                  <span className="font-bold">Company:</span>{" "}
                  {testimonial.company}
                </span>
                <span className="font-thin text-sm">
                  <span className="font-bold">Title:</span> {testimonial.title}
                </span>
              </div>
              <div className="col-span-6 row-start-3 mt-6 grid w-full gap-2 place-self-center sm:col-auto sm:row-auto sm:mt-0 sm:w-auto sm:flex-col  ">
                {status === "authenticated" && session.user?.admin && (
                  <button
                    className=""
                    onClick={async (e) => {
                      e.preventDefault();
                      await handleTestimonialFeaturedToggle(testimonial.id);
                    }}
                  >
                    <div className="btn btn-outline btn-sm h-fit w-full  sm:w-fit">
                      <input
                        type="checkbox"
                        id={testimonial.id}
                        className="checkbox checkbox-sm m-1"
                        checked={testimonial.highlighted}
                        readOnly
                      ></input>
                      <span className="ml-2 text-xs">Featured</span>
                    </div>
                  </button>
                )}
                <TestimonialEditDialog
                  updateHandler={handleTestimonialUpdate}
                  testimonial={testimonial}
                >
                  <span className="btn btn-outline btn-sm">
                    <IoMdConstruct className="mr-2" />
                    Edit
                  </span>
                </TestimonialEditDialog>
                <TestimonialDeleteDialog
                  handleTestimonialDelete={handleTestimonialDelete}
                  testimonial={{ name: testimonial.name, id: testimonial.id }}
                >
                  <div className="btn btn-outline btn-error btn-sm w-full">
                    <IoMdTrash className="mr-2" />
                    Delete
                  </div>
                </TestimonialDeleteDialog>
              </div>
            </div>
          ))}
          <div className="rounded-lg bg-base-300 p-4 drop-shadow-2xl">
            <TestimonialEditDialog updateHandler={handleTestimonialCreate}>
              <button className="btn btn-primary btn-block">
                Create New testimonial
              </button>
            </TestimonialEditDialog>
          </div>
        </div>
      )}
    </div>
  );
}
