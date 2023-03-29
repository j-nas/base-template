import { toast, Toaster } from "react-hot-toast";
import Breadcrumbs from "../../../components/adminComponents/Breadcrumbs";
import LoadingSpinner from "../../../components/LoadingSpinner";
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
import { useSession } from "next-auth/react";

type FormData = {
  title: string;
  primaryImage: string;
  markdown: string;
  summary: string;
};

export const BlogEditor = () => {
  const router = useRouter();
  const submitMutation = api.blog.update.useMutation();
  const { data: session } = useSession();
  const {
    data: data,
    isLoading,
    error,
  } = api.blog.getById.useQuery({
    id: router.query.slug as string,
  });
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

  const handleSubmit = async (formData: FormData) => {
    const { title, primaryImage, markdown, summary } = formData;
    const submission = {
      id: data?.id || "",
      title,
      primaryImage,
      markdown: markdown,
      summary: summary,
    };
    await toast.promise(
      submitMutation.mutateAsync(submission, {
        onSuccess: async () => {
          await ctx.blog.invalidate();
          await ctx.blog.getById.refetch({
            id: router.query.slug as string,
          });
        },
        onError: (error) => {
          console.log(error);
          toast.error(error.message);
        },
      }),
      {
        loading: "Submitting...",
        success: "Submitted!",
        error: "Error",
      }
    );
    formRef.current?.setIsDirty(false);
  };
  if (error?.data?.httpStatus === 400) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="font-bold text-2xl">Blog post not found.</h1>
        <Link href="/admin/blog">
          <span className="text-primary">Go back to services</span>
        </Link>
      </div>
    );
  }
  if (session?.user?.id !== data?.userId) {
    if (!session?.user?.superAdmin) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <h1 className="font-bold text-2xl">
            You do not have permission to edit this blog post.
          </h1>
          <Link href="/admin/blog">
            <span className="text-primary">Go back to services</span>
          </Link>
        </div>
      );
    }
  }

  return (
    <div className="relative flex h-full w-full flex-col place-items-center overflow-auto pb-12 scrollbar-thin scrollbar-track-base-200 scrollbar-thumb-primary scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg">
      <>
        <Toaster position="bottom-right" />
        {data && (
          <Breadcrumbs
            subName="Blog Manager"
            subPath="blog"
            subSubName={data.title}
          />
        )}

        <div className="my-8 flex flex-col">
          <h1 className=" place-self-center text-center font-black  text-2xl">
            {data?.title}{" "}
          </h1>
          {data && (
            <>
              <span>
                Author: <span className="italic">{data.author.name}</span>
              </span>
              <span>
                Last updated:{" "}
                {new Intl.DateTimeFormat(undefined, {
                  dateStyle: "long",
                  timeStyle: "short",
                }).format(data.updatedAt)}
              </span>
            </>
          )}
          {isLoading && <LoadingSpinner />}
        </div>
        {data && (
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
                        initialValue={data.title}
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
                                <span
                                  key={error}
                                  className="text-error text-xs"
                                >
                                  {error}
                                </span>
                              ))}
                          </div>
                        )}
                      </Field>
                    </div>
                    <Field<string>
                      name="summary"
                      initialValue={data.summary}
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
                            <span
                              className={`${isDirty ? "text-success" : ""}`}
                            >
                              {150 - value.length} characters remaining
                            </span>
                          )}
                        </div>
                      )}
                    </Field>
                    <Field<string>
                      name="primaryImage"
                      initialValue={data.primaryImage?.image.public_id}
                      ref={primaryImageRef}
                    >
                      {({ value, isDirty }) => (
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
                              className={`btn-outline btn-square btn h-fit w-fit p-6 ${
                                isDirty ? "btn-success" : ""
                              }`}
                            >
                              <div className="overflow-hidden">
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
                                  placeholder="blur"
                                  blurDataURL={
                                    data.primaryImage?.image.blur_url
                                  }
                                />
                              </div>
                            </button>
                          </ImageSelectDialog>
                        </div>
                      )}
                    </Field>

                    <Field<string>
                      name="markdown"
                      initialValue={data.markdown}
                      ref={contentRef}
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
                        </div>
                      )}
                    </Field>
                    <div className="place-self-end">
                      <Link href="/admin/services" className="btn mr-2">
                        Back to services
                      </Link>
                      <button
                        onClick={submit}
                        className={`btn-success btn ${
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
        )}
      </>
    </div>
  );
};

export default BlogEditor;

BlogEditor.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
