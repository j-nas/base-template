import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdCloseCircle } from "react-icons/io";
import { MdOutlineHideImage } from "react-icons/md";
import { api } from "../../../utils/api";
import LoadingSpinner from "../../LoadingSpinner";
import { CldImage } from "next-cloudinary";
import { env } from "../../../env/client.mjs";
import { ImNewTab } from "react-icons/im";
import Link from "next/link";

export type ImagePosition =
  | "primary"
  | "secondary"
  | "hero"
  | "avatar"
  | "gallery";

type Props = {
  children: React.ReactNode;
  position: ImagePosition;
  originId?: string;
  handleImageChange: (
    value: string,
    position: ImagePosition,
    originId?: string
  ) => void;
};

export default function ImageSelectDialog({
  children,
  handleImageChange,
  position,
  originId,
}: Props) {
  const { isLoading, data } = api.image.getAllImages.useQuery();
  const [selectedImage, setSelectedImage] = React.useState<string>("");
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className=" fixed inset-0 z-40 h-screen w-screen bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[80vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-base-300 p-6  drop-shadow-xl">
          <Dialog.Title className="font-bold text-lg">
            Select {position} image
          </Dialog.Title>
          {/* <div className="mt-6 w-full place-content-center md:flex">help</div> */}
          <span>
            To upload a new image go to{" "}
            <Link
              href="/admin/images"
              target="_blank"
              className="link inline-flex"
            >
              Image Management
              <ImNewTab className="link ml-2 translate-y-1" />
            </Link>
          </span>
          <div className="m-2 flex h-[40vh] flex-wrap place-content-start overflow-auto rounded-lg bg-base-100 text-base-content drop-shadow-2xl scrollbar-thin scrollbar-track-base-100 scrollbar-thumb-primary scrollbar-track-rounded-lg md:m-8">
            {isLoading ? (
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              data?.map((image) => (
                <button
                  key={image.public_id}
                  className={`btn-outline btn-square btn  m-2 h-24 w-24 cursor-pointer p-1 ${
                    selectedImage === image.public_id ? "btn-primary" : ""
                  }`}
                  onClick={() => setSelectedImage(image.public_id)}
                >
                  <div className="overflow-hidden rounded-lg">
                    <CldImage
                      src={
                        env.NEXT_PUBLIC_CLOUDINARY_FOLDER +
                        "/" +
                        image.public_id
                      }
                      alt={image.public_id}
                      className="rounded-lg object-cover transition-all hover:scale-110"
                      crop="thumb"
                      placeholder="blur"
                      blurDataURL={image.blur_url}
                      height={100}
                      width={100}
                    />
                  </div>
                </button>
              ))
            )}
            {position === "avatar" && (
              <button
                className={`btn-outline btn-square btn  m-2 h-24 w-24 cursor-pointer p-1 ${
                  selectedImage === "default" ? "btn-primary" : ""
                }`}
                onClick={() => setSelectedImage("")}
              >
                <MdOutlineHideImage className="text-3xl" />
                <span>No Image</span>
              </button>
            )}
          </div>
          <span>Selected image: {selectedImage || "none"}</span>
          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <button aria-label="cancel" className={`btn-warning btn `}>
                Cancel
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                onClick={() =>
                  handleImageChange(selectedImage, position, originId)
                }
                className="btn-primary btn ml-2"
              >
                Accept
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              className="btn-ghost btn-circle btn absolute top-3 right-3"
              aria-label="Close"
            >
              <IoMdCloseCircle className="text-xl" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
