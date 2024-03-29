import { toast, Toaster } from "react-hot-toast";
import Breadcrumbs from "@/adminComponents/Breadcrumbs";
import LoadingSpinner from "@/LoadingSpinner";
import IconDisplay, { type IconList } from "@/IconDisplay";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { type Services } from "@prisma/client";
import { type ParsedUrlQuery } from "querystring";
import Layout from "@/adminComponents/Layout";
import { type ReactElement } from "react";
import { Form, Field, type FieldInstance, type FormInstance } from "houseform";
import IconSelectDialog from "@/adminComponents/dialogs/IconSelectDialog";
import ImageSelectDialog, {
  type ImagePosition,
} from "@/adminComponents/dialogs/ImageSelectDialog";
import React from "react";
import { CldImage } from "next-cloudinary";
import { env } from "~/env/client.mjs";
import Link from "next/link";
import ServiceContentEditor from "@/adminComponents/TextEditor";
import { z } from "zod";
import { useSession } from "next-auth/react";
import NotAuthorized from "@/adminComponents/NotAuthorized";
export interface ServicePageQuery extends ParsedUrlQuery {
  slug: Services;
}

type FormData = {
  title: string;
  icon: string;
  primaryImage: string;
  secondaryImage: string;
  content: string;
  description: string;
};

export const ServiceEditor = () => {
  const router = useRouter();
  const session = useSession();

  const servicePage = router.query.slug as string;
  const servicePageFormatted = servicePage.toUpperCase() as Services;
  const submitMutation = api.service.update.useMutation();

  const {
    data: data,
    isLoading,
    error,
  } = api.service.getByPosition.useQuery({
    position: servicePageFormatted,
  });
  const ctx = api.useContext();
  const iconRef = React.useRef<FieldInstance>(null);
  const primaryImageRef = React.useRef<FieldInstance>(null);
  const secondaryImageRef = React.useRef<FieldInstance>(null);
  const contentRef = React.useRef<FieldInstance>(null);
  const formRef = React.useRef<FormInstance>(null);

  if (!session.data?.user?.admin) {
    return <NotAuthorized />;
  }
  const handleIconChange = (value: string) => {
    iconRef.current?.setValue(value);
  };
  const handleImageChange = (value: string, position: ImagePosition) => {
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
    const { title, icon, primaryImage, secondaryImage, content, description } =
      formData;
    const submission = {
      id: data?.id || "",
      title,
      icon,
      primaryImage,
      secondaryImage,
      content: content,
      summary: description,
    };
    await toast.promise(
      submitMutation.mutateAsync(submission, {
        onSuccess: async () => {
          await ctx.service.invalidate();
          await ctx.service.getByPosition.refetch({
            position: servicePageFormatted,
          });
        },
        onError: (error) => {
          console.log(error);
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
        <h1 className="font-bold text-2xl">Service not found</h1>
        <Link href="/admin/services">
          <span className="text-primary">Go back to services</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col place-items-center overflow-auto pb-12 scrollbar-thin scrollbar-track-base-200 scrollbar-thumb-primary scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg">
      <>
        <Toaster position="bottom-right" />
        {data && (
          <Breadcrumbs
            subName="Services Manager"
            subPath="services"
            subSubName={data.title}
          />
        )}

        <div className="my-8">
          <h1 className=" place-self-center text-center font-black  text-2xl">
            {data?.title}{" "}
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
              <Form
                onSubmit={(values) => handleSubmit(values as FormData)}
                ref={formRef}
              >
                {({ submit, errors }) => (
                  <React.Fragment>
                    <div className="flex flex-col">
                      <Field<IconList>
                        name="icon"
                        initialValue={data?.icon as IconList}
                        ref={iconRef}
                      >
                        {({ value, isDirty }) => (
                          <div className="flex flex-col">
                            <label
                              className={`font-bold tracking-wide text-sm ${
                                isDirty ? "text-success" : ""
                              }`}
                            >
                              Icon
                            </label>
                            <IconSelectDialog
                              handleIconChange={handleIconChange}
                            >
                              <div className="flex w-52">
                                <button
                                  className={`btn btn-outline btn-square ${
                                    isDirty ? "btn-success" : ""
                                  }`}
                                >
                                  <IconDisplay icon={value} />
                                </button>
                                <input
                                  readOnly
                                  value={value}
                                  className="input input-disabled ml-2 w-full"
                                />
                              </div>
                            </IconSelectDialog>
                          </div>
                        )}
                      </Field>
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
                              
                              ${isDirty ? "text-success" : ""}`}
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
                              errors.length > 0 ? "!text-error" : ""
                            } ${isDirty ? "text-success" : ""}`}
                          >
                            Description
                          </label>
                          <textarea
                            className={`textarea-bordered textarea   w-52 resize-none scrollbar-thin 
                            ${errors.length > 0 ? "!textarea-error" : ""}
                            ${isDirty ? "textarea-success" : ""} 
                            `}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            rows={6}
                            maxLength={150}
                          />
                          {errors.length > 0 ? (
                            errors.map((error) => (
                              <span key={error} className="text-error">
                                {error}
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
                      initialValue={data.primaryImage.public_id}
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
                              className={`btn btn-outline btn-square h-fit w-fit p-6 ${
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
                      {({ value, isDirty }) => (
                        <div className="flex flex-col">
                          <label
                            className={`font-bold tracking-wide text-sm ${
                              isDirty ? "text-success" : ""
                            }`}
                          >
                            Secondary Image
                          </label>
                          <ImageSelectDialog
                            position="secondary"
                            handleImageChange={handleImageChange}
                          >
                            <button
                              className={`btn btn-outline btn-square h-fit w-fit p-6 ${
                                isDirty ? "btn-success" : ""
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
                      name="content"
                      initialValue={data.content}
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
        )}
      </>
    </div>
  );
};

export default ServiceEditor;

ServiceEditor.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
