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

export const ImageManager = () => {
  const { data: images } = api.image.getAllImages.useQuery();
  const [uploading, setUploading] = useState(false);
  const [buffer, setBuffer] = useState(0);
  const renameMutation = api.image.renameImage.useMutation();

  const renameHandler = (
    imageId: string,
    newName: string,
    public_id: string
  ) => {
    renameMutation.mutate({ id: imageId, name: newName, public_id: public_id });
    console.log({ renameMutation });
  };
  const uploadHandler = (e: any) => {};

  return (
    <div className="relative grid h-full w-full place-items-center overflow-auto">
      <div>
        <h1 className="mt-6 font-black  text-2xl">Image Managment</h1>
      </div>
      <div className=" m-8 flex flex-wrap place-content-center place-items-center gap-8 place-self-center  align-middle">
        {images?.map((image) => (
          <div
            key={image.id}
            className="flex w-56 flex-col place-self-start rounded-lg bg-base-200 drop-shadow-xl "
          >
            <div className="overflow-hidden rounded-t-lg">
              <CldImage
                src={env.NEXT_PUBLIC_CLOUDINARY_FOLDER + "/" + image.public_id}
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
              <ImageDeleteDialog image={image}>
                <button className="btn-error btn-sm btn">Delete</button>
              </ImageDeleteDialog>
              <ImageRenameDialog renameHandler={renameHandler} image={image}>
                <button className="btn-primary btn-sm btn">Rename</button>
              </ImageRenameDialog>
            </span>
          </div>
        ))}
        <div className="flex flex-col place-self-start">
          <ImageUploadDialog>
            <button className="overflow-hidden  bg-accent text-accent-content hover:bg-accent-focus">
              <IoMdAdd className="h-[200px] w-[200px] transition-all hover:scale-125" />
            </button>
          </ImageUploadDialog>
          <span className="text-center">Upload Image</span>
        </div>
      </div>
    </div>
  );
};

export default ImageManager;

ImageManager.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
