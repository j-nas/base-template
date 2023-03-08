import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { api, type RouterOutputs } from "../../utils/api";
import { IoMdCloseCircle } from "react-icons/io";
import ImageInUseWidget from "./ImageInUseWidget";
type Props = {
  children: React.ReactNode;
  image: RouterOutputs["image"]["getImageById"];
};

export default function ImageRenameDialog({ children, image }: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 h-screen w-screen bg-black/50 blur-3xl" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-[80vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-base-300 p-6 drop-shadow-xl">
          <Dialog.Title className="font-bold text-lg">
            Rename Image
          </Dialog.Title>
          <Dialog.Description className="mt-2 mb-5">
            Note: It may take a few minutes before changes are reflected on the
            site.
          </Dialog.Description>
          <div className="flex flex-col gap-2">
            <div className=" mx-2 flex   flex-col place-content-center gap-2 place-self-center  px-4 py-2"></div>
          </div>
          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <button aria-label="rename" className="btn-success btn ">
                Confirm Rename
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
