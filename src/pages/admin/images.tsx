import React, { type ReactElement, useState } from "react";
import { Layout } from "../../components/AdminComponents";
import { api } from "../../utils/api";
import { formatBytes } from "../../utils/format";
import { CldImage } from "next-cloudinary";
import { env } from "../../env/client.mjs";
import Tooltip from "../../components/Tooltip";
import { IoMdAdd } from "react-icons/io";
import ImageDeleteDialog from "../../components/adminComponents/ImageDeleteDialog";
import ImageRenameDialog from "../../components/adminComponents/ImageRenameDialog";
import ImageUploadDialog from "../../components/adminComponents/ImageUploadDialog";
import toast, { Toaster } from "react-hot-toast";
import Breadcrumbs from "../../components/adminComponents/Breadcrumbs";
import { RouterOutputs } from "../../utils/api";

type Sorting =
  | "nameAsc"
  | "nameDes"
  | "sizeAsc"
  | "sizeDes"
  | "dateAsc"
  | "dateDes";

const sorters = [
  { name: "Name (A-Z)", value: "nameAsc" as Sorting },
  { name: "Name (Z-A)", value: "nameDes" as Sorting },
  { name: "Size (Low-High)", value: "sizeAsc" as Sorting },
  { name: "Size (High-Low)", value: "sizeDes" as Sorting },
  { name: "Date (Old-New)", value: "dateAsc" as Sorting },
  { name: "Date (New-Old)", value: "dateDes" as Sorting },
];

export const ImageManager = () => {
  const { data: images, isLoading } = api.image.getAllImages.useQuery();
  const [sort, setSort] = useState("nameDes");
  const [uploading, setUploading] = useState(false);
  const [buffer, setBuffer] = useState(0);
  const renameMutation = api.image.renameImage.useMutation();
  const uploadMutation = api.image.uploadImage.useMutation();
  const deleteMutation = api.image.deleteImage.useMutation();
  const ctx = api.useContext();

  const handleRename = async (
    imageId: string,
    newName: string,
    public_id: string
  ) => {
    toast.promise(
      renameMutation.mutateAsync(
        { id: imageId, name: newName, public_id: public_id },
        {
          onSuccess: () => {
            ctx.image.getAllImages.refetch();
          },
          onError: (error) => {
            toast.error(error.message);
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
  const handleUpload = async (base64: string, publicId: string) => {
    const fileName = publicId.split(".")[0] || `image-${Date.now()}`;
    toast.promise(
      uploadMutation.mutateAsync(
        { file: base64, public_id: fileName },
        {
          onSuccess: () => {
            ctx.image.getAllImages.refetch();
          },
          onError: (error) => {
            toast.error(error.message);
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
    toast.promise(
      deleteMutation.mutateAsync(
        { public_id: public_id },
        {
          onSuccess: () => {
            ctx.image.getAllImages.refetch();
          },
          onError: (error) => {
            toast.error(error.message);
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
        return images.sort((a: any, b: any) =>
          a.public_id.localeCompare(b.public_id)
        );
      case "nameDes":
        return images.sort((a: any, b: any) =>
          b.public_id.localeCompare(a.public_id)
        );
      case "sizeAsc":
        return images.sort((a: any, b: any) => a.bytes - b.bytes);
      case "sizeDes":
        return images.sort((a: any, b: any) => b.bytes - a.bytes);
      case "dateAsc":
        return images.sort((a: any, b: any) => a.createdAt - b.createdAt);
      case "dateDes":
        return images.sort((a: any, b: any) => b.createdAt - a.createdAt);
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
      {isLoading && (
        <div className="flex flex-col place-content-center place-items-center gap-2">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <span>Loading...</span>
        </div>
      )}
      {!isLoading && (
        <div className="form-control ml-8 mt-6 place-self-center lg:place-self-start">
          <div className="input-group">
            <span className="text-md font-bold uppercase">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="select-bordered select"
            >
              {sorters.map((sorter) => (
                <option key={sorter.value} value={sorter.value}>
                  {sorter.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div className=" m-8 flex flex-wrap place-content-center place-items-center gap-8 place-self-center  align-middle md:place-content-start">
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
                  <button className="btn-error btn-sm btn">Delete</button>
                </ImageDeleteDialog>
                <ImageRenameDialog renameHandler={handleRename} image={image}>
                  <button className="btn-primary btn-sm btn">Rename</button>
                </ImageRenameDialog>
              </span>
            </div>
          ))}
        {!isLoading && (
          <div className="flex flex-col place-self-start">
            <ImageUploadDialog handleUpload={handleUpload}>
              <button className="overflow-hidden rounded-lg bg-base-300 drop-shadow-xl transition-all hover:brightness-150">
                <IoMdAdd className="h-[200px] w-[224px] transition-all hover:scale-125" />
              </button>
            </ImageUploadDialog>
            <span className="text-center">Upload Image</span>
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
