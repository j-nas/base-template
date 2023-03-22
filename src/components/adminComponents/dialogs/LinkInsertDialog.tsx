import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdCloseCircle } from "react-icons/io";
import { Form, Field } from "houseform";
import { z } from "zod";
import { ImageAdmin } from "../../../types/image";
import InputWrapper from "../../InputWrapper";

type Props = {
  children: React.ReactNode;
  setLink: (link: string) => void;
  previousUrl: string;
};

export default function LinkInsertDialog({
  children,
  setLink,
  previousUrl,
}: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className=" fixed inset-0 z-40 h-screen w-screen bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="glass fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[80vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 text-primary-content drop-shadow-xl">
          <Dialog.Title className="font-bold text-lg">
            Enter URL of link
          </Dialog.Title>
          <Dialog.Description className="mt-2 mb-5"></Dialog.Description>
          <Form
            onSubmit={(values) => {
              setLink(values.link);
              setOpen(false);

              return;
            }}
          >
            {({ submit }) => (
              <>
                <div className="flex flex-col gap-2">
                  <div className=" mx-2 flex   flex-col place-content-center gap-2 place-self-center  px-4 py-2">
                    <Field
                      name="link"
                      initialValue={previousUrl}
                      onChangeValidate={z
                        .string()
                        .url({ message: "Please enter a valid URL" })
                        .optional()}
                    >
                      {({ value, setValue, onBlur, errors }) => (
                        <InputWrapper
                          error={errors[0]}
                          label="Link"
                          htmlFor="link"
                        >
                          <input
                            type="url"
                            id="link"
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
                    className="btn btn-success"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
          </Form>
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
