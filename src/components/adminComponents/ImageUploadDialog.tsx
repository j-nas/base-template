import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { api, type RouterOutputs } from "../../utils/api";
import { IoMdCloseCircle } from "react-icons/io";
import Link from "next/link";
import ImageInUseWidget from "./ImageInUseWidget";
import { Field, Form } from "houseform";
import { z } from "zod";
import Image from "next/image";
type Props = {
  children: React.ReactNode;
  handleUpload: (input: string) => void;
};

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export default function ImageUploadDialog({ children, handleUpload }: Props) {
  const [open, setOpen] = React.useState(false);
  const [base64, setBase64] = React.useState<string | null>(null);
  const [tempImage, setTempImage] = React.useState<FileList | null>(null);

  const encodeBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <Dialog.Root onOpenChange={() => setBase64(null)}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 h-screen w-screen bg-black/50 blur-3xl" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-[80vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-base-300 p-6 drop-shadow-xl">
          <Dialog.Title className="font-bold text-lg">
            Upload Image
          </Dialog.Title>
          <Dialog.Description className="mt-2 mb-5">
            Select an image to upload. Only .jpg, .jpeg, .png and .webp formats.
            Please keep the size under 5MB.
          </Dialog.Description>
          <Form
            onSubmit={(values) => {
              console.log(values.file[0]);
              return;
            }}
          >
            {({ submit, errors, getFieldValue }) => (
              <>
                <Field
                  name="file"
                  onChangeValidate={z
                    .instanceof(File, { message: "Please select a file" })
                    .refine((file) => file.size <= MAX_FILE_SIZE, {
                      message: "File size must be less than 5MB",
                    })
                    .refine(
                      (file) => {
                        return ACCEPTED_IMAGE_TYPES.includes(file.type);
                      },
                      {
                        message:
                          "Only .jpg, .jpeg, .png and .webp formats are supported.",
                      }
                    )}
                >
                  {({ value, setValue, onBlur, errors }) => (
                    <>
                      <input
                        type="file"
                        className="w-full"
                        accept="image/*"
                        onChange={(e) => {
                          if (!e.target.files) return null;
                          const file = e.target.files[0];

                          setValue(() => {
                            return file;
                          });
                          if (!file) return null;
                          encodeBase64(file).then((base64) => {
                            console.log({ base64 });
                            setBase64(base64);
                          });
                        }}
                        onBlur={onBlur}
                        multiple={false}
                      />

                      <div className="flex flex-col">
                        {errors &&
                          errors.map((error) => (
                            <span key={error} className="text-error">
                              {error}
                            </span>
                          ))}
                      </div>
                    </>
                  )}
                </Field>
                <div>
                  {base64 && (
                    <div className="relative mt-4 flex h-full w-full place-content-center">
                      <Image
                        src={base64}
                        height={200}
                        width={200}
                        alt="preview"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-end">
                  <>
                    <Dialog.Close asChild>
                      <button className="btn" aria-label="Cancel" type="button">
                        Cancel
                      </button>
                    </Dialog.Close>

                    <button
                      onClick={submit}
                      aria-label="upload"
                      type="submit"
                      className={`btn-success btn ml-2 ${
                        errors.length > 0 && "btn-disabled"
                      } `}
                    >
                      Upload
                    </button>
                  </>
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
