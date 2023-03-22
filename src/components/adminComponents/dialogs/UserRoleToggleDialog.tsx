import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { api, type RouterOutputs } from "../../../utils/api";
import { IoMdCloseCircle } from "react-icons/io";
import Link from "next/link";
import ImageInUseWidget from "../ImageInUseWidget";
import type { User } from "@prisma/client";

type Props = {
  children: React.ReactNode;
  user: User;
  handleToggleAdmin: (user: User) => void;
};

export default function UserRoleToggleDialog({
  children,
  handleToggleAdmin,
  user,
}: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className=" fixed inset-0 z-40 h-screen w-screen bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="glass fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[80vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 text-primary-content drop-shadow-xl">
          <Dialog.Title className="font-bold text-lg">
            Toggle User Role
          </Dialog.Title>
          <div className="flex flex-col gap-2">
            <span>Are you sure? This will log out the user.</span>
          </div>
          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <button
                aria-label="confirm"
                className={`btn btn-success `}
                onClick={() => {
                  handleToggleAdmin(user);
                }}
              >
                Confirm
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              className="btn btn-ghost btn-circle absolute top-3 right-3"
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
