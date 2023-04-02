import { toast, Toaster } from "react-hot-toast";
import Breadcrumbs from "../../../components/adminComponents/Breadcrumbs";
import { api } from "../../../utils/api";
import { useRouter } from "next/router";
import Layout from "../../../components/adminComponents/Layout";
import { type ReactElement } from "react";
import { Form, Field, type FieldInstance, type FormInstance } from "houseform";
import ImageSelectDialog from "../../../components/adminComponents/dialogs/ImageSelectDialog";
import React from "react";
import { CldImage } from "next-cloudinary";
import { env } from "../../../env/client.mjs";
import Link from "next/link";
import ServiceContentEditor from "../../../components/adminComponents/TextEditor";
import { z } from "zod";

type FormData = {
  title: string;
  primaryImage: string;
  content: string;
  summary: string;
};

export const BlogEditor = () => {
  const router = useRouter();
  const submitMutation = api.blog.create.useMutation();

  const ctx = api.useContext();
  const primaryImageRef = React.useRef<FieldInstance>(null);
  const contentRef = React.useRef<FieldInstance>(null);
  const formRef = React.useRef<FormInstance>(null);

  const handleImageChange = (value: string) => {
    primaryImageRef.current?.setValue(value);
  };

  const handleContentChange = (value: string) => {
    contentRef.current?.setValue(value);
  };
  console.log(primaryImageRef.current?.value);
  const handleSubmit = async (formData: FormData) => {
    console.log(formData);
    await toast.promise(
      submitMutation.mutateAsync(formData, {
        onSuccess: async () => {
          await ctx.blog.invalidate();
          await ctx.blog.getById.refetch({
            id: router.query.slug as string,
          });
          await router.push("/admin/blog");
        },
        onError: (error) => {
          console.log(error);
        },
      }),
      {
        loading: "Submitting...",
        success: "New Blog Submitted!",
        error: "Error Submitting Blog",
      }
    );
    formRef.current?.setIsDirty(false);
  };

  return (
    <div className="relative flex h-full w-full flex-col place-items-center overflow-auto pb-12 scrollbar-thin scrollbar-track-base-200 scrollbar-thumb-primary scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg">
      <>
        <Toaster position="bottom-right" />

        <Breadcrumbs
          subName="Blog Manager"
          subPath="blog"
          subSubName="New Blog"
        />

        <div className="my-8">
          <h1 className=" place-self-center text-center font-black  text-2xl">
            New Blog
          </h1>
        </div>
        <div>
          <div className="mx-auto flex h-full w-full flex-wrap justify-evenly justify-items-stretch gap-4">
            <Form
              onSubmit={(values) => handleSubmit(values as FormData)}
              ref={formRef}
            >
              {({ submit, errors }) => (
                <React.Fragment>
                  <div className="flex flex-col">
                    <Field<string>
                      name="title"
                      initialValue=""
                      onChangeValidate={z
                        .string()
                        .min(1, { message: "Required" })
                        .max(50, { message: "Max 50 characters" })
                        .regex(/^[a-zA-Z0-9 ]*$/, {
                          message: "Only letters, numbers and spaces",
                        })}
                    >
                      {({ value, setValue, isDirty, errors }) => (
                        <div className="mx-auto flex w-52 flex-col">
                          <label
                            className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""} 
                              
                              ${isDirty ? "text-success" : ""} 
                            `}
                          >
                            Title
                          </label>
                          <input
                            className={`input-bordered input ${
                              isDirty ? "input-success" : ""
                            } ${errors.length > 0 ? "input-error" : ""}`}
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
                  <Field<string>
                    name="summary"
                    initialValue=""
                    onChangeValidate={z
                      .string()
                      .min(1, { message: "Required" })
                      .max(150, { message: "Max 150 characters" })}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="flex flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm ${
                            errors.length > 0 ? "!text-error" : ""
                          } ${isDirty ? "text-success" : ""}`}
                        >
                          Description
                        </label>
                        <textarea
                          className={`textarea-bordered textarea   w-52 resize-none scrollbar-thin 
                            ${errors.length > 0 ? "!textarea-error" : ""}
                            ${isDirty ? "textarea-success" : ""}} 
                            `}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          rows={6}
                          maxLength={150}
                        />
                        {errors.length > 0 ? (
                          errors.map((e) => (
                            <span key={e} className="text-error">
                              {e}
                            </span>
                          ))
                        ) : (
                          <span className={`${isDirty ? "text-success" : ""}`}>
                            {150 - value.length} characters remaining
                          </span>
                        )}
                      </div>
                    )}
                  </Field>
                  <Field<string>
                    name="primaryImage"
                    initialValue=""
                    ref={primaryImageRef}
                    onChangeValidate={z
                      .string()
                      .min(1, { message: "Required" })}
                  >
                    {({ value, isDirty, errors }) => (
                      <div className="flex flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm ${
                            isDirty ? "text-success" : ""
                          }`}
                        >
                          Primary Image
                        </label>
                        <ImageSelectDialog
                          position="primary"
                          handleImageChange={handleImageChange}
                        >
                          <button
                            className={`btn btn-outline btn-square h-fit w-fit p-6 ${
                              isDirty ? "btn-success" : ""
                            }`}
                          >
                            <div className="overflow-hidden">
                              {primaryImageRef.current?.value ? (
                                <CldImage
                                  src={
                                    env.NEXT_PUBLIC_CLOUDINARY_FOLDER +
                                    "/" +
                                    value
                                  }
                                  alt="Primary Image"
                                  width={158}
                                  height={158}
                                  className="rounded-xl object-center transition-all hover:scale-110"
                                  crop="thumb"
                                />
                              ) : (
                                <div className="flex h-40 w-40 flex-col items-center justify-center rounded-xl bg-gray-200">
                                  <span className="text-gray-500 text-2xl">
                                    <i className="fas fa-image"></i>
                                  </span>
                                  <span className="text-gray-500 text-sm">
                                    Select Image
                                  </span>
                                </div>
                              )}
                              {errors.length > 0 &&
                                errors.map((error) => (
                                  <span
                                    key={error}
                                    className="text-error text-xs"
                                  >
                                    {error}
                                  </span>
                                ))}
                            </div>
                          </button>
                        </ImageSelectDialog>
                      </div>
                    )}
                  </Field>

                  <Field<string>
                    name="content"
                    initialValue=""
                    ref={contentRef}
                    onChangeValidate={z
                      .string()
                      .min(1, { message: "Required" })}
                  >
                    {({ value, isDirty }) => (
                      <div className="flex  w-11/12 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm ${
                            isDirty ? "text-success" : ""
                          }`}
                        >
                          Main Content
                        </label>
                        <ServiceContentEditor
                          setContent={handleContentChange}
                          content={value}
                          isDirty={isDirty}
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
                  <div className="place-self-end">
                    <Link href="/admin/services" className="btn mr-2">
                      Back to services
                    </Link>
                    <button
                      onClick={submit}
                      className={`btn btn-success ${
                        errors.length > 0 ? "btn-disabled" : ""
                      }`}
                    >
                      Save Changes
                    </button>
                  </div>
                </React.Fragment>
              )}
            </Form>
          </div>
        </div>
      </>
    </div>
  );
};

export default BlogEditor;

BlogEditor.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
