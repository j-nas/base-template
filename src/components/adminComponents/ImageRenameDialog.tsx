import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdCloseCircle } from "react-icons/io";
import { Form, Field } from "houseform";
import { z } from "zod";
import { ImageAdmin } from "../../types/image";

type Props = {
  children: React.ReactNode;
  renameHandler: (newName: string, id: string, public_id: string) => void;
  image: ImageAdmin;
};

export default function ImageRenameDialog({
  children,
  renameHandler,
  image,
}: Props) {
  const [newName, setNewName] = React.useState<string>("");

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
          <Form
            onSubmit={(values) =>
              renameHandler(image.id, values.newName, image.public_id)
            }
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
                        <input
                          type="text"
                          className="input-bordered input w-full"
                          onChange={(e) => setValue(e.target.value)}
                          value={value}
                          onBlur={onBlur}
                        />
                      )}
                    </Field>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Dialog.Close asChild>
                    <button
                      onClick={submit}
                      aria-label="rename"
                      className="btn-success btn "
                    >
                      Confirm Rename
                    </button>
                  </Dialog.Close>
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
