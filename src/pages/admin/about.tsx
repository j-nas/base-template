import { toast, Toaster } from "react-hot-toast";
import Breadcrumbs from "../../components/adminComponents/Breadcrumbs";
import LoadingSpinner from "../../components/LoadingSpinner";
import IconDisplay from "../../components/IconDisplay";
import { api } from "../../utils/api";
import { IoMdHelpCircle } from "react-icons/io";
import Layout from "../../components/adminComponents/Layout";
import { ReactElement } from "react";
import { Form, Field, FieldInstance, FormInstance } from "houseform";
import IconSelectDialog from "../../components/adminComponents/dialogs/IconSelectDialog";
import ImageSelectDialog from "../../components/adminComponents/dialogs/ImageSelectDialog";
import React from "react";
import { CldImage } from "next-cloudinary";
import { env } from "../../env/client.mjs";
import Link from "next/link";
import ServiceContentEditor from "../../components/adminComponents/TextEditor";
import { z } from "zod";

type FormData = {
  title: string;
  icon: string;
  primaryImage: string;
  secondaryImage: string;
  markdown: string;
  description: string;
};

export const AboutUsEditor = () => {
  const submitMutation = api.aboutUs.update.useMutation();
  const {
    data: data,
    isLoading,
    error,
  } = api.aboutUs.getCurrentWithDate.useQuery();
  const ctx = api.useContext();
  const primaryImageRef = React.useRef<FieldInstance>(null);
  const secondaryImageRef = React.useRef<FieldInstance>(null);
  const contentRef = React.useRef<FieldInstance>(null);
  const formRef = React.useRef<FormInstance>(null);

  const handleImageChange = (
    value: string,
    position: "primary" | "secondary" | "hero"
  ) => {
    if (position === "primary") {
      primaryImageRef.current?.setValue(value);
    } else {
      secondaryImageRef.current?.setValue(value);
    }
  };

  const handleContentChange = (value: string) => {
    contentRef.current?.setValue(value);
  };

  const handleSubmit = async (formData: FormData) => {
    const { title, primaryImage, secondaryImage, markdown, description } =
      formData;
    const submission = {
      id: data?.id || "",
      title,
      primaryImage,
      secondaryImage,
      markdown: markdown,
      summary: description,
    };
    await toast.promise(
      submitMutation.mutateAsync(submission, {
        onSuccess: async () => {
          ctx.aboutUs.invalidate();
          ctx.aboutUs.getCurrentWithDate.refetch();
        },
        onError: async (error) => {
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

  return (
    <div className="relative flex h-full w-full flex-col place-items-center overflow-auto pb-12 scrollbar-thin scrollbar-track-base-200 scrollbar-thumb-primary scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg">
      <>
        <Toaster position="bottom-right" />
        {data && <Breadcrumbs subName="About Us Editor" subPath="about" />}

        <div className="my-8">
          <h1 className=" place-self-center text-center font-black  text-2xl">
            About Us Editor{" "}
            {/* <span className="tooltip tooltip-left">
              <IoMdHelpCircle />
            </span> */}
          </h1>
          {data && (
            <span>
              Last updated:{" "}
              {new Intl.DateTimeFormat(undefined, {
                dateStyle: "long",
                timeStyle: "short",
              }).format(data.updatedAt)}
            </span>
          )}
          {isLoading && <LoadingSpinner />}
        </div>
        {data && (
          <div>
            <div className="mx-auto flex h-full w-full flex-wrap justify-evenly justify-items-stretch gap-4">
              <Form onSubmit={(values) => handleSubmit(values)} ref={formRef}>
                {({ submit, errors }) => (
                  <React.Fragment>
                    <Field<string>
                      name="description"
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
                              errors.length > 0 && "!text-error"
                            } ${isDirty && "text-success"}`}
                          >
                            Summary
                          </label>
                          <textarea
                            className={`textarea-bordered textarea   w-52 resize-none scrollbar-thin 
                            ${errors.length > 0 && "!textarea-error"}
                            ${isDirty && "textarea-success"} 
                            `}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            rows={6}
                            maxLength={150}
                          />
                          {errors.length > 0 ? (
                            errors.map((e) => (
                              <span className="text-error">{e}</span>
                            ))
                          ) : (
                            <span className={`${isDirty && "text-success"}`}>
                              {150 - value.length} characters remaining
                            </span>
                          )}
                        </div>
                      )}
                    </Field>
                    <Field<string>
                      name="primaryImage"
                      initialValue={data.primaryImage.public_id}
                      ref={primaryImageRef}
                    >
                      {({ value, setValue, isDirty }) => (
                        <div className="flex flex-col">
                          <label
                            className={`font-bold tracking-wide text-sm ${
                              isDirty && "text-success"
                            }`}
                          >
                            Primary Image
                          </label>
                          <ImageSelectDialog
                            position="primary"
                            handleImageChange={handleImageChange}
                          >
                            <button
                              className={`btn-outline btn btn-square h-fit w-fit p-6 ${
                                isDirty && "btn-success"
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
                                  blurDataURL={data.primaryImage.blur_url}
                                />
                              </div>
                            </button>
                          </ImageSelectDialog>
                        </div>
                      )}
                    </Field>
                    <Field<string>
                      name="secondaryImage"
                      initialValue={data.secondaryImage.public_id}
                      ref={secondaryImageRef}
                    >
                      {({ value, setValue, isDirty }) => (
                        <div className="flex flex-col">
                          <label
                            className={`font-bold tracking-wide text-sm ${
                              isDirty && "text-success"
                            }`}
                          >
                            Secondary Image
                          </label>
                          <ImageSelectDialog
                            position="secondary"
                            handleImageChange={handleImageChange}
                          >
                            <button
                              className={`btn-outline btn btn-square h-fit w-fit p-6 ${
                                isDirty && "btn-success"
                              }`}
                            >
                              <div className="overflow-hidden rounded-xl">
                                <CldImage
                                  src={
                                    env.NEXT_PUBLIC_CLOUDINARY_FOLDER +
                                    "/" +
                                    value
                                  }
                                  alt="Secondary Image"
                                  width={158}
                                  height={158}
                                  className="rounded-xl object-center transition-all hover:scale-110 "
                                  crop="thumb"
                                  placeholder="blur"
                                  blurDataURL={data.secondaryImage.blur_url}
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
                      {({ value, setValue, isDirty }) => (
                        <div className="flex  w-11/12 flex-col">
                          <label
                            className={`font-bold tracking-wide text-sm ${
                              isDirty && "text-success"
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
                      <button
                        onClick={submit}
                        className={`btn btn-success ${
                          errors.length > 0 && "btn-disabled"
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

export default AboutUsEditor;

AboutUsEditor.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
