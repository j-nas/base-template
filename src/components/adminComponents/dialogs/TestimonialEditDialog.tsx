import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdCloseCircle } from "react-icons/io";
import { Form, Field } from "houseform";
import { z } from "zod";
import { type Testimonial } from "@prisma/client";

type Props = {
  children: React.ReactNode;
  updateHandler: (
    testimonial: Omit<Testimonial, "createdAt" | "highlighted">
  ) => void;
  testimonial?: Omit<Testimonial, "createdAt">;
};

type FormData = {
  name: string;
  title: string;
  company: string;
  quote: string;
};

export default function TestimonialEditDialog({
  children,
  updateHandler,
  testimonial,
}: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className=" fixed inset-0 z-40 h-screen w-screen bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="glass fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[80vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 text-primary-content drop-shadow-xl">
          <Dialog.Title className="font-bold text-lg">
            {testimonial ? "Edit Testimonial" : "Add Testimonial"}
          </Dialog.Title>
          <Dialog.Description className="mt-2 mb-5">
            Note: It may take a few minutes before changes are reflected on the
            site.
          </Dialog.Description>
          <Form
            onSubmit={(values) => {
              updateHandler({
                ...(values as FormData),
                id: testimonial?.id || "",
              });
              setOpen(false);
            }}
          >
            {({ submit }) => (
              <>
                <div className="flex flex-col gap-2">
                  <div className=" mx-2 flex   flex-col place-content-center gap-2 place-self-center  px-4 py-2">
                    <Field<string>
                      name="name"
                      initialValue={testimonial?.name || ""}
                      onChangeValidate={z
                        .string()
                        .min(1, { message: "Must not be blank" })
                        .max(28, { message: "Please limit to 28 characters" })}
                    >
                      {({ value, setValue, onBlur, errors, isDirty }) => (
                        <div className="mx-auto flex w-52 flex-col">
                          <label
                            className={`font-bold tracking-wide text-sm 
                          ${errors.length > 0 ? "!text-error" : ""} 
                          
                          ${isDirty ? "text-success" : ""} 
                        `}
                          >
                            Name
                          </label>
                          <input
                            className={`input-bordered input ${
                              isDirty ? "input-success" : ""
                            } ${errors.length > 0 ? "input-error" : ""}`}
                            value={value}
                            onBlur={onBlur}
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
                      name="title"
                      initialValue={testimonial?.title || ""}
                      onChangeValidate={z
                        .string()
                        .min(1, { message: "Must not be blank" })
                        .max(28, { message: "Please limit to 28 characters" })}
                    >
                      {({ value, setValue, onBlur, errors, isDirty }) => (
                        <div className="mx-auto flex w-52 flex-col">
                          <label
                            className={`font-bold tracking-wide text-sm 
                          ${errors.length > 0 ? "!text-error" : ""} 
                          
                          ${isDirty ? "text-success" : ""} 
                        `}
                          >
                            Job Title
                          </label>
                          <input
                            className={`input-bordered input ${
                              isDirty ? "input-success" : ""
                            } ${errors.length > 0 ? "input-error" : ""}`}
                            value={value}
                            onBlur={onBlur}
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
                      name="company"
                      initialValue={testimonial?.company || ""}
                      onChangeValidate={z
                        .string()
                        .min(1, { message: "Must not be blank" })
                        .max(28, { message: "Please limit to 28 characters" })}
                    >
                      {({ value, setValue, onBlur, errors, isDirty }) => (
                        <div className="mx-auto flex w-52 flex-col">
                          <label
                            className={`font-bold tracking-wide text-sm 
                          ${errors.length > 0 ? "!text-error" : ""} 
                          
                          ${isDirty ? "text-success" : ""} 
                        `}
                          >
                            Company
                          </label>
                          <input
                            className={`input-bordered input ${
                              isDirty ? "input-success" : ""
                            } ${errors.length > 0 ? "input-error" : ""}`}
                            value={value}
                            onBlur={onBlur}
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
                      name="quote"
                      initialValue={testimonial?.quote || ""}
                      onChangeValidate={z
                        .string()
                        .min(1, { message: "Must not be blank" })
                        .max(28, { message: "Please limit to 28 characters" })}
                    >
                      {({ value, setValue, onBlur, errors, isDirty }) => (
                        <div className="mx-auto flex w-52 flex-col">
                          <label
                            className={`font-bold tracking-wide text-sm 
                          ${errors.length > 0 ? "!text-error" : ""} 
                          
                          ${isDirty ? "text-success" : ""} 
                        `}
                          >
                            Quote
                          </label>
                          <input
                            className={`input-bordered input ${
                              isDirty ? "input-success" : ""
                            } ${errors.length > 0 ? "input-error" : ""}`}
                            value={value}
                            onBlur={onBlur}
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
                    aria-label="submit"
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
