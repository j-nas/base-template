import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdCloseCircle } from "react-icons/io";

type Props = {
  children: React.ReactNode;
  testimonial: {
    name: string;
    id: string;
  };
  handleTestimonialDelete: (id: string) => void;
};

export default function TestimonialDeleteDialog({
  children,
  handleTestimonialDelete,
  testimonial,
}: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className=" fixed inset-0 z-40 h-screen w-screen bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="glass fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[80vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 text-primary-content drop-shadow-xl">
          <Dialog.Title className="font-bold text-lg">
            Delete {testimonial.name}
          </Dialog.Title>
          <div className="flex flex-col gap-2">
            <span>
              Are you sure? This will permantly delete the testimonial from{" "}
              {testimonial.name}
            </span>
            <span>This action cannot be reversed.</span>
          </div>
          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <button aria-label="cancel" className={`btn mr-2 `}>
                Cancel
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                aria-label="confirm"
                className={`btn-error btn `}
                onClick={() => {
                  handleTestimonialDelete(testimonial.id);
                }}
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
