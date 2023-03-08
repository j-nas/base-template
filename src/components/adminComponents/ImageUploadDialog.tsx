import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { api, type RouterOutputs } from "../../utils/api";
import { IoMdCloseCircle } from "react-icons/io";
import Link from "next/link";
import ImageInUseWidget from "./ImageInUseWidget";
type Props = {
  children: React.ReactNode;
};

export default function ImageUploadDialog({ children }: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 h-screen w-screen bg-black/50 blur-3xl" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-[80vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-base-300 p-6 drop-shadow-xl">
          <Dialog.Title className="font-bold text-lg">
            Upload Image
          </Dialog.Title>
          <Dialog.Description className="mt-2 mb-5">
            Select an image to upload
          </Dialog.Description>
          <div className="flex flex-col gap-2">
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">10MB Limit</span>
              </label>
              <input
                type="file"
                className="file-input-bordered file-input w-full max-w-xs"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <button aria-label="delete" className="btn-success btn ">
                Upload
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
