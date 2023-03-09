import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdCloseCircle } from "react-icons/io";
import { Form, Field } from "houseform";
import { z } from "zod";
import { ImageAdmin } from "../../types/image";
import InputWrapper from "../InputWrapper";

type Props = {
  children: React.ReactNode;
  renameHandler: (
    newName: string,
    id: string,
    public_id: string
  ) => Promise<void>;
  image: ImageAdmin;
};

export default function ImageRenameDialog({
  children,
  renameHandler,
  image,
}: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className=" fixed inset-0 z-40 h-screen w-screen bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[80vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-base-300 p-6 drop-shadow-xl">
          <Dialog.Title className="font-bold text-lg">
            Rename Image
          </Dialog.Title>
          <Dialog.Description className="mt-2 mb-5">
            Note: It may take a few minutes before changes are reflected on the
            site.
          </Dialog.Description>
          <Form
            onSubmit={(values) => {
              renameHandler(image.id, values.newName, image.public_id).then(
                () => {
                  setOpen(false);
                }
              );

              return;
            }}
          >
            {({ submit }) => (
              <>
                <div className="flex flex-col gap-2">
                  <div className=" mx-2 flex   flex-col place-content-center gap-2 place-self-center  px-4 py-2">
                    <Field
                      name="newName"
                      initialValue={image.public_id}
                      onChangeValidate={z
                        .string()
                        .min(1, { message: "Must not be blank" })
                        .max(28, { message: "Please limit to 28 characters" })
                        .regex(/^[a-zA-Z0-9-_]+$/, {
                          message: "Please use only letters, numbers, - and _",
                        })}
                    >
                      {({ value, setValue, onBlur, errors }) => (
                        <InputWrapper
                          error={errors[0]}
                          label="New Name"
                          htmlFor="newName"
                        >
                          <input
                            type="text"
                            id="newName"
                            className="input-bordered input w-full"
                            onChange={(e) => setValue(e.target.value)}
                            value={value}
                            onBlur={onBlur}
                          />
                        </InputWrapper>
                      )}
                    </Field>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Dialog.Close asChild>
                    <button className="btn mr-2">Cancel</button>
                  </Dialog.Close>
                  <button
                    onClick={submit}
                    aria-label="rename"
                    type="submit"
                    className="btn-success btn"
                  >
                    Confirm Rename
                  </button>
                </div>
              </>
            )}
          </Form>
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
