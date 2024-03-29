import React, { type ReactElement, useState, type MouseEvent } from "react";
import Layout from "../../components/adminComponents/Layout";
import { api, type RouterInputs, type RouterOutputs } from "../../utils/api";
import { formatBytes } from "../../utils/format";
import {
  CldImage,
  CldUploadWidget,
  type CldUploadWidgetPropsOptions,
} from "next-cloudinary";
import { env } from "../../env/client.mjs";
import Tooltip from "../../components/Tooltip";
import { IoMdAdd } from "react-icons/io";
import ImageDeleteDialog from "../../components/adminComponents/dialogs/ImageDeleteDialog";
import ImageRenameDialog from "../../components/adminComponents/dialogs/ImageRenameDialog";
import toast, { Toaster } from "react-hot-toast";
import Breadcrumbs from "../../components/adminComponents/Breadcrumbs";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type Sorting =
  | "nameAsc"
  | "nameDes"
  | "sizeAsc"
  | "sizeDes"
  | "dateAsc"
  | "dateDes";

const sorters = [
  { name: "Name (A-Z)", value: "nameAsc" satisfies Sorting },
  { name: "Name (Z-A)", value: "nameDes" satisfies Sorting },
  { name: "Size (Low-High)", value: "sizeAsc" satisfies Sorting },
  { name: "Size (High-Low)", value: "sizeDes" satisfies Sorting },
  { name: "Date (Old-New)", value: "dateAsc" satisfies Sorting },
  { name: "Date (New-Old)", value: "dateDes" satisfies Sorting },
];

interface ImageResult {
  info: RouterInputs["image"]["uploadImage"];
}

const cloudinaryOptions: CldUploadWidgetPropsOptions = {
  maxVideoFileSize: 1,
  resourceType: "image",
  clientAllowedFormats: ["png", "jpg", "jpeg"],
};

export const ImageManager = () => {
  const { data: images, isLoading } = api.image.getAllImages.useQuery();
  const { data: size } = api.image.getTotalSize.useQuery();
  const [sort, setSort] = useState<Sorting>("dateAsc");
  const [parent] = useAutoAnimate();
  const renameMutation = api.image.renameImage.useMutation();
  const uploadMutation = api.image.uploadImage.useMutation();
  const deleteMutation = api.image.deleteImage.useMutation();
  const ctx = api.useContext();

  const maxSizeExceeded =
    size?._sum.bytes && size._sum.bytes > env.NEXT_PUBLIC_IMAGE_STORAGE_LIMIT;
  const handleRename = async (
    imageId: string,
    newName: string,
    public_id: string
  ) => {
    await toast.promise(
      renameMutation.mutateAsync(
        { id: imageId, name: newName, public_id: public_id },
        {
          onSuccess: async () => {
            await ctx.image.getAllImages.refetch();
            await ctx.image.getTotalSize.refetch();
          },
          onError: (error) => {
            console.error(error.message);
          },
        }
      ),
      {
        loading: "Renaming...",
        success: "Image renamed",
        error: "Error renaming image",
      }
    );
    console.log({ renameMutation });
    return;
  };
  const handleUpload = async ({ info }: ImageResult) => {
    await toast.promise(
      uploadMutation.mutateAsync(
        { ...info, public_id: info.public_id.split("/")[1] as string },
        {
          onSuccess: async () => {
            await ctx.image.getAllImages.refetch();
            await ctx.image.getTotalSize.refetch();
          },
          onError: (error) => {
            if (error.message.includes("Unique constraint failed")) {
              toast.error("Image already exists");
            } else {
              console.error(error.message);
            }
          },
        }
      ),
      {
        loading: "Uploading image...",
        success: "Image uploaded",
        error: "Error uploading image",
      }
    );
    console.log({ uploadMutation });
    return;
  };
  const handleDelete = async (public_id: string) => {
    await toast.promise(
      deleteMutation.mutateAsync(
        { public_id: public_id },
        {
          onSuccess: async () => {
            await ctx.image.getAllImages.refetch();
            await ctx.image.getTotalSize.refetch();
          },
          onError: (error) => {
            console.error(error.message);
          },
        }
      ),
      {
        loading: "Deleting image...",
        success: "Image deleted",
        error: "Error deleting image",
      }
    );
    console.log({ deleteMutation });
    return;
  };

  const sortImages = (
    images: RouterOutputs["image"]["getAllImages"],
    sort: string
  ) => {
    switch (sort) {
      case "nameAsc":
        return images.sort((a, b) => a.public_id.localeCompare(b.public_id));
      case "nameDes":
        return images.sort((a, b) => b.public_id.localeCompare(a.public_id));
      case "sizeAsc":
        return images.sort((a, b) => a.bytes - b.bytes);
      case "sizeDes":
        return images.sort((a, b) => b.bytes - a.bytes);
      case "dateAsc":
        return images.sort(
          (a, b) => a.createdAt.valueOf() - b.createdAt.valueOf()
        );
      case "dateDes":
        return images.sort(
          (a, b) => b.createdAt.valueOf() - a.createdAt.valueOf()
        );
      default:
        return images;
    }
  };

  return (
    <div className="relative grid h-full w-full place-items-center overflow-auto">
      <Toaster position="bottom-right" />
      <Breadcrumbs subName="Image Manager" subPath="images" />
      <div>
        <h1 className="mt-6 place-self-center text-center font-black  text-2xl">
          Image Managment
        </h1>
      </div>
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <div className="mx-auto mt-6 flex w-52 flex-col">
          <label htmlFor="sort" className="font-bold tracking-wide text-sm">
            Sort
          </label>
          <select
            value={sort}
            id="sort"
            onChange={(e) => setSort(e.target.value as Sorting)}
            className="select-bordered select select-sm mb-12"
          >
            {sorters.map((sorter) => (
              <option key={sorter.value} value={sorter.value}>
                {sorter.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div
        ref={parent}
        className=" m-8 flex flex-wrap place-content-center place-items-center gap-8 place-self-center pb-8  align-middle md:place-content-start"
      >
        {images &&
          sortImages(images, sort)?.map((image) => (
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
              <Tooltip content={image.public_id}>
                <span className="truncate px-2">
                  {image.public_id}.{image.format}
                </span>
              </Tooltip>
              <span className="px-2">{formatBytes(image.bytes)}</span>
              <span className="space-x-2 p-2">
                <ImageDeleteDialog image={image} handleDelete={handleDelete}>
                  <button className="btn btn-error btn-sm">Delete</button>
                </ImageDeleteDialog>
                <ImageRenameDialog renameHandler={handleRename} image={image}>
                  <button className="btn btn-primary btn-sm">Rename</button>
                </ImageRenameDialog>
              </span>
            </div>
          ))}
        {!isLoading && !maxSizeExceeded ? (
          <div className="flex flex-col place-self-start">
            <CldUploadWidget
              uploadPreset={env.NEXT_PUBLIC_CLOUDINARY_FOLDER}
              onUpload={(res: ImageResult) => {
                void handleUpload(res);
              }}
              options={cloudinaryOptions}
            >
              {({ open }) => {
                const handleClick = (e: MouseEvent) => {
                  e.preventDefault();
                  open();
                };
                return (
                  <button
                    onClick={handleClick}
                    className="overflow-hidden rounded-lg bg-base-300 drop-shadow-xl transition-all hover:brightness-150"
                  >
                    <IoMdAdd className="h-[200px] w-[224px] transition-all hover:scale-125" />
                  </button>
                );
              }}
            </CldUploadWidget>
            <span className="text-center">Upload Image</span>
          </div>
        ) : (
          <div className="flex max-w-[224px] flex-col place-self-start">
            <div className="  h-[200px] w-[224px] cursor-not-allowed overflow-hidden rounded-lg bg-base-300 drop-shadow-xl">
              <IoMdAdd className="h-[200px] w-[224px] text-base-100" />
            </div>
            <span className="text-center">
              Image storage is at full capacity. Contact{" "}
              <a className="link" href="mailto:sales@shorecel.com">
                sales@shorecel.com
              </a>{" "}
              to increase image storage.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageManager;

ImageManager.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
