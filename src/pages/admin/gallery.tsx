import React, { type ReactElement, useState } from "react";
import { type GalleryPosition } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { CldImage } from "next-cloudinary";
import { IoMdAdd, IoMdHelpCircle } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";

import { api } from "~/utils/api";
import { env } from "~/env/client.mjs";

import Breadcrumbs from "@/adminComponents/Breadcrumbs";
import LoadingSpinner from "@/LoadingSpinner";
import Layout from "@/adminComponents/Layout";
import GalleryAltTextEditDialog from "@/adminComponents/dialogs/GalleryAltTextEditDialog";
import ImageSelectDialog from "@/adminComponents/dialogs/ImageSelectDialog";
import NotAuthorized from "@/adminComponents/NotAuthorized";

export const GalleryManager = () => {
  const { data: session, status } = useSession();
  const [position, setPosition] = useState<GalleryPosition>("MAIN");
  const { data: gallery, isLoading } = api.gallery.getByPosition.useQuery(
    {
      position,
    },
    { refetchOnMount: "always", cacheTime: 0 }
  );
  const [parent] = useAutoAnimate();
  const editAltTextMutation = api.gallery.updateAltText.useMutation();
  const addImageMutation = api.gallery.addImage.useMutation();
  const removeMutation = api.gallery.removeImage.useMutation();
  const indexSwapMutation = api.gallery.swapIndex.useMutation();
  const ctx = api.useContext();

  const handleAltTextEdit = async (id: string, altText: string) => {
    await toast.promise(
      editAltTextMutation.mutateAsync(
        { id, altText, position },
        {
          onSuccess: async () => {
            await ctx.gallery.invalidate();
            await ctx.gallery.getByPosition.refetch({ position });
          },
          onError: (error) => {
            console.log(error);
          },
        }
      ),
      {
        loading: "Renaming...",
        success: "Image renamed",
        error: "Error renaming image",
      }
    );
    return;
  };
  const handleAddImage = async (public_id: string) => {
    if (!gallery) return;
    await toast.promise(
      addImageMutation.mutateAsync(
        { id: public_id, position, index: gallery?.length + 1 },
        {
          onSuccess: async () => {
            await ctx.gallery.invalidate();
            await ctx.gallery.getByPosition.refetch({ position });
          },
          onError: (error) => {
            if (error.message.includes("Unique constraint failed")) {
              toast.error("Image already exists in gallery");
            }
            console.error(error.message);
          },
        }
      ),
      {
        loading: "Adding image...",
        success: "Image added to gallery",
        error: "Error adding image",
      }
    );
    return;
  };
  const handleRemove = async (id: string) => {
    await toast.promise(
      removeMutation.mutateAsync(
        { id, position },
        {
          onSuccess: async () => {
            await ctx.gallery.invalidate();
            await ctx.gallery.getByPosition.refetch({ position });
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      ),
      {
        loading: "Removing image...",
        success: "Image removed from gallery",
        error: "Error deleting image",
      }
    );
    return;
  };
  const handleIndexSwap = async (
    id: string,
    oldIndex: number,
    newIndex: number
  ) => {
    await toast.promise(
      indexSwapMutation.mutateAsync(
        { id, position, oldIndex, newIndex },
        {
          onSuccess: async () => {
            await ctx.gallery.invalidate();
            await ctx.gallery.getByPosition.refetch({ position });
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      ),
      {
        loading: "Re-ordering images...",
        success: "Images re-ordered",
        error: "Error swapping images",
      }
    );
    return;
  };

  const options = Array.from({ length: gallery?.length || 1 }, (_, i) => (
    <option key={i} value={i + 1}>
      {i + 1}
    </option>
  ));

  if (status === "loading" || !session?.user?.admin) {
    return <NotAuthorized />;
  }

  return (
    <div className="relative grid h-full w-full place-items-center overflow-auto">
      <Toaster position="bottom-right" />
      <Breadcrumbs subName="Gallery Manager" subPath="gallery" />
      <div>
        <h1 className="my-6 place-self-center text-center font-black tracking-tight text-2xl">
          Gallery Editor
        </h1>
        <div className="mx-auto flex w-52 flex-col">
          <label htmlFor="position" className="font-bold tracking-wide text-sm">
            Position
            {position === "FRONT" && (
              <span
                className="tooltip tooltip-left"
                data-tip="Only the first 9 images are shown on the landing page gallery"
              >
                <IoMdHelpCircle />
              </span>
            )}
          </label>
          <select
            id="position"
            placeholder="Select an position"
            value={position as string}
            className="select-bordered select select-sm mb-12"
            onChange={(e) => {
              setPosition(e.target.value as GalleryPosition);
            }}
          >
            <option value={"MAIN"}>Main Gallery Page</option>
            <option value={"FRONT"}>Landing Page Gallery</option>
          </select>
        </div>
      </div>
      {isLoading && <LoadingSpinner />}

      <div
        ref={parent}
        className=" m-8 flex flex-wrap place-content-center place-items-center gap-8 place-self-center pb-8  align-middle md:place-content-start"
      >
        {gallery &&
          gallery
            ?.sort((a, b) => (a.index || 0) - (b.index || 0))
            .map((image) => (
              <div
                key={image.id}
                className="flex w-56 flex-col place-self-start rounded-lg bg-base-200 drop-shadow-xl "
              >
                <div className="overflow-hidden rounded-t-lg">
                  <CldImage
                    src={
                      env.NEXT_PUBLIC_CLOUDINARY_FOLDER + "/" + image.public_id
                    }
                    width="224"
                    height="200"
                    crop="thumb"
                    gravity="auto"
                    alt={image.public_id}
                    placeholder="blur"
                    blurDataURL={image.blur_url}
                    className="overflow-hidden transition hover:scale-125 hover:brightness-150"
                  />
                </div>

                <span className="px-2 italic">&quot;{image.altText}&quot;</span>
                <span className="space-x-2 p-2">
                  <GalleryAltTextEditDialog
                    handleAltTextEdit={handleAltTextEdit}
                    image={image}
                  >
                    <button className="btn btn-primary btn-sm">Edit</button>
                  </GalleryAltTextEditDialog>

                  <button
                    onClick={() => handleRemove(image.id)}
                    className="btn btn-error btn-sm"
                  >
                    Remove
                  </button>
                  <select
                    className=" h-8 place-self-center rounded-lg bg-base-100 p-1"
                    defaultValue={image.index || 1}
                    value={image.index || 1}
                    onChange={(e) => {
                      if (parseInt(e.target.value) === image.index) return;
                      void handleIndexSwap(
                        image.id,
                        image.index || 1,
                        parseInt(e.target.value)
                      );
                    }}
                  >
                    {options}
                  </select>
                </span>
              </div>
            ))}

        {!isLoading && (
          <div className="flex flex-col self-start">
            <ImageSelectDialog
              position="gallery"
              handleImageChange={handleAddImage}
            >
              <button className="overflow-hidden rounded-lg bg-base-300 drop-shadow-xl transition-all hover:brightness-150">
                <IoMdAdd className="h-[200px] w-[224px] transition-all hover:scale-125" />
              </button>
            </ImageSelectDialog>
            <span className="text-center">Add Image</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManager;

GalleryManager.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
