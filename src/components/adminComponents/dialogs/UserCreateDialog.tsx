import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdCloseCircle } from "react-icons/io";
import { Form, Field } from "houseform";
import z from "zod";

type Props = {
  children: React.ReactNode;
  handleUserCreate: (user: string, email: string) => void;
};

export default function UserCreateDialog({
  children,
  handleUserCreate,
}: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className=" fixed inset-0 z-40 h-screen w-screen bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="glass fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[80vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 text-primary-content drop-shadow-xl">
          <Dialog.Title className="font-bold text-lg">
            Create new user
          </Dialog.Title>
          <div className="flex flex-col gap-2">
            <span>
              Enter user&apos;s name and email. Email address must be valid, as
              it is used for authentication.
            </span>
          </div>
          <Form
            onSubmit={(values) => {
              handleUserCreate(values.name as string, values.email as string);
              setOpen(false);
            }}
          >
            {({ submit, errors }) => (
              <>
                <div className="flex flex-col gap-2">
                  <div className=" mx-2 flex   flex-col place-content-center gap-2 place-self-center  px-4 py-2">
                    <Field<string>
                      name="name"
                      onChangeValidate={z
                        .string()
                        .min(1, { message: "Must not be blank" })
                        .max(50, { message: "Please limit to 50 characters" })
                        .regex(/^[a-zA-Z0-9\s]+$/, {
                          message: "Please use only letters and numbers",
                        })}
                    >
                      {({ value, setValue, onBlur, errors, isDirty }) => (
                        <div className="mx-auto flex w-52 flex-col">
                          <label
                            className={`font-bold tracking-wide text-sm 
                          ${(errors.length > 0 && "!text-error") || ""}
                          
                          ${(isDirty && "text-success") || ""} 
                        }`}
                          >
                            Name
                          </label>
                          <input
                            onBlur={onBlur}
                            className={`input-bordered input ${
                              (isDirty && "input-success") || ""
                            } ${(errors.length > 0 && "input-error") || ""}`}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                          />
                          {errors.length > 0 &&
                            errors.map((error) => (
                              <span key={error} className="text-error text-xs">
                                {error}
                              </span>
                            ))}
                        </div>
                      )}
                    </Field>
                    <Field<string>
                      name="email"
                      onChangeValidate={z
                        .string()
                        .min(1, { message: "Must not be blank" })
                        .email({ message: "Please use a valid email adress" })}
                    >
                      {({ value, setValue, onBlur, errors, isDirty }) => (
                        <div className="mx-auto flex w-52 flex-col">
                          <label
                            className={`font-bold tracking-wide text-sm 
                          ${(errors.length > 0 && "!text-error") || ""}
                          
                          ${(isDirty && "text-success") || ""} 
                        }`}
                          >
                            Email
                          </label>
                          <input
                            onBlur={onBlur}
                            type="email"
                            className={`input-bordered input ${
                              (isDirty && "input-success") || ""
                            } ${(errors.length > 0 && "input-error") || ""}`}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                          />
                          {errors.length > 0 &&
                            errors.map((error) => (
                              <span key={error} className="text-error text-xs">
                                {error}
                              </span>
                            ))}
                        </div>
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
                    className={`btn btn-success ${
                      (errors.length > 0 && "btn-disabled") || ""
                    }`}
                  >
                    Add User
                  </button>
                </div>
              </>
            )}
          </Form>

          <Dialog.Close asChild>
            <button className="btn btn-ghost btn-circle absolute top-3 right-3">
              <IoMdCloseCircle className="text-xl" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
