import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { api, type RouterOutputs } from "../../utils/api";
import { IoMdCloseCircle } from "react-icons/io";
import Link from "next/link";
import ImageInUseWidget from "./ImageInUseWidget";
import type { ImageAdmin } from "../../types/image";

type Props = {
  children: React.ReactNode;
  image: ImageAdmin;
};

export default function ImageDeleteDialog({ children, image }: Props) {
  const { inUseProps } = image;

  const isImageInuse = (
    Object.keys(inUseProps) as (keyof typeof inUseProps)[]
  ).some((key) => inUseProps[key].length > 0);

  const description = isImageInuse ? (
    <Dialog.Description className="mt-2 mb-5">
      This image is in use. Please reassign the image from the following, before
      deleting:
    </Dialog.Description>
  ) : (
    <Dialog.Description className="mt-2 mb-5">
      Are you sure you want to delete this image?
    </Dialog.Description>
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className=" fixed inset-0 z-40 h-screen w-screen bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[80vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-base-300 p-6 drop-shadow-xl">
          <Dialog.Title className="font-bold text-lg">
            Delete Image
          </Dialog.Title>
          {description}
          <div className="flex flex-col gap-2">
            <ImageInUseWidget image={image} />
          </div>
          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <button
                aria-label="delete"
                className={`btn-error btn ${isImageInuse && "btn-disabled"}`}
              >
                Confirm Delete
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
