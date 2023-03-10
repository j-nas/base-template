import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdCloseCircle } from "react-icons/io";
import { formatBytes } from "../../utils/format";
import { Field, Form, type FieldInstance } from "houseform";
import { z } from "zod";
import Image from "next/image";

type Props = {
  children: React.ReactNode;
  handleUpload: (base64: string, publicId: string) => Promise<void>;
};

const MAX_FILE_SIZE = 4000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export default function ImageUploadDialog({ children, handleUpload }: Props) {
  const [base64, setBase64] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const encodeBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const fieldRef = React.useRef<FieldInstance>(null);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={() => {
        setBase64(null);
        return setOpen(!open);
      }}
    >
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className=" fixed inset-0 z-40 h-screen w-screen bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[80vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-base-300 p-6 drop-shadow-xl">
          <Dialog.Title className="font-bold text-lg">
            Upload Image
          </Dialog.Title>
          <Dialog.Description className="mt-2 mb-5">
            Select an image to upload. Only .jpg, .jpeg, .png and .webp formats.
            Please keep the size under 4MB.
          </Dialog.Description>
          <Form
            onSubmit={(values) => {
              encodeBase64(values.file).then((base64) => {
                handleUpload(base64, values.file.name).then(() => {
                  setOpen(false);
                });
              });
            }}
          >
            {({ submit, errors }) => (
              <>
                <Field
                  ref={fieldRef}
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
                  {({ setValue, onBlur, errors }) => (
                    <>
                      <input
                        type="file"
                        className="file-input-primary file-input w-full"
                        accept="image/*"
                        onChange={(e) => {
                          if (!e.target.files) return null;
                          const file = e.target.files[0];

                          setValue(() => {
                            console.log({ file });
                            return file;
                          });
                          if (!file) return null;
                          if (!ACCEPTED_IMAGE_TYPES.includes(file.type))
                            return null;
                          if (file.size > MAX_FILE_SIZE) return null;
                          encodeBase64(file).then((base64) => {
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
                    <div className="relative m-4 flex aspect-auto h-full max-h-[30vh] place-content-center">
                      <Image
                        src={base64}
                        height={200}
                        width={200}
                        alt="preview"
                        className="object-contain "
                      />
                    </div>
                  )}
                  {fieldRef.current && (
                    <div className="flex flex-col">
                      <span>{fieldRef.current?.value.name}</span>
                      <span>
                        {fieldRef.current?.value.size === undefined
                          ? ""
                          : formatBytes(fieldRef.current?.value.size, 2)}
                      </span>
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
