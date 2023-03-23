import { toast, Toaster } from "react-hot-toast";
import Breadcrumbs from "../../../components/adminComponents/Breadcrumbs";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { api } from "../../../utils/api";
import { IoMdConstruct, IoMdHelpCircle, IoMdTrash } from "react-icons/io";
import { Services } from "@prisma/client";
import { ParsedUrlQuery } from "querystring";
import Layout from "../../../components/adminComponents/Layout";
import { ReactElement } from "react";
import { Form, Field, FieldInstance, FormInstance } from "houseform";
import ImageSelectDialog from "../../../components/adminComponents/dialogs/ImageSelectDialog";
import React from "react";
import { CldImage } from "next-cloudinary";
import { env } from "../../../env/client.mjs";
import { z } from "zod";
import { useState, useEffect } from "react";
import Link from "next/link";
export interface ServicePageQuery extends ParsedUrlQuery {
  slug: Services;
}

type FormData = {
  id: string;
  name: string;
  email: string;
  avatarImage: string | undefined;
};

export const ServiceEditor = () => {
  const [avatarImageExists, setAvatarImageExists] = useState(false);

  const userUpdateMutation = api.user.update.useMutation();
  const blogDeleteMutation = api.blog.delete.useMutation();

  const { isLoading, data, isError, error } = api.user.getSelf.useQuery();

  if (isError) {
    return (
      <div className="grid h-full w-full place-content-center font-bold text-2xl">
        Error loading user. Check the URL and try again.
      </div>
    );
  }

  useEffect(() => {
    if (data?.avatarImage?.public_id) {
      setAvatarImageExists(true);
    }
    return () => {
      setAvatarImageExists(false);
    };
  }, [data]);

  const ctx = api.useContext();
  const avatarImageRef = React.useRef<FieldInstance>(null);
  const formRef = React.useRef<FormInstance>(null);

  const handleImageChange = (value: string, _position: string) => {
    avatarImageRef.current?.setValue(value);
  };

  const handleSubmit = async (formData: FormData) => {
    const { name, email, avatarImage, id } = formData;
    const submission = {
      email,
      name,
      avatarImage,
      id,
    };
    await toast.promise(
      userUpdateMutation.mutateAsync(
        { ...submission, avatarImageExists },
        {
          onSuccess: async () => {
            await ctx.user.invalidate();
            await ctx.user.getById.refetch({
              id: id,
            });
          },
          onError: async (error) => {
            if (
              error.message.endsWith(
                "Unique constraint failed on the fields: (`email`)"
              )
            ) {
              toast.error("Email already in use");
            }
            if (
              error.message.endsWith(
                "Unique constraint failed on the fields: (`name`)"
              )
            ) {
              toast.error("Names must be unique");
            }
          },
        }
      ),
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
        {data && (
          <Breadcrumbs
            subName="User Management"
            subPath="user"
            subSubName={data.name || "User"}
          />
        )}

        <div className="my-8">
          <h1 className=" place-self-center text-center font-black  text-2xl">
            {data?.name} Profile
            <span className="tooltip tooltip-left">
              <IoMdHelpCircle />
            </span>
          </h1>

          {isLoading && <LoadingSpinner />}
        </div>
        {data && (
          <div>
            <div className="mx-auto flex h-full w-full flex-wrap justify-evenly justify-items-stretch gap-4">
              <Form
                onSubmit={(values) => handleSubmit({ ...values, id: data.id })}
                ref={formRef}
              >
                {({ submit, errors }) => (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="flex flex-col">
                      <Field<string>
                        name="name"
                        initialValue={data.name}
                        onChangeValidate={z
                          .string()
                          .min(1, { message: "Required" })
                          .max(50, { message: "Max 50 characters" })
                          .regex(/^[a-zA-Z0-9 ']*$/, {
                            message: "Only letters, numbers and spaces",
                          })}
                      >
                        {({ value, setValue, isDirty, errors }) => (
                          <div className="mx-auto flex w-52 flex-col">
                            <label
                              className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 && "!text-error"}
                              
                              ${isDirty && "text-success"} 
                            }`}
                            >
                              Name
                            </label>
                            <input
                              className={`input-bordered input ${
                                isDirty && "input-success"
                              } ${errors.length > 0 && "input-error"}`}
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
                      <Field<string>
                        name="email"
                        initialValue={data.email}
                        onChangeValidate={z
                          .string()
                          .min(1, { message: "Required" })
                          .max(50, { message: "Max 50 characters" })
                          .email({ message: "Invalid email" })}
                      >
                        {({ value, setValue, isDirty, errors }) => (
                          <div className="mx-auto flex w-52 flex-col">
                            <label
                              className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 && "!text-error"}
                              
                              ${isDirty && "text-success"} 
                            }`}
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              className={`input-bordered input ${
                                isDirty && "input-success"
                              } ${errors.length > 0 && "input-error"}`}
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
                      initialValue={data.avatarImage.public_id}
                      name="avatarImage"
                      ref={avatarImageRef}
                    >
                      {({ value, setValue, isDirty }) => (
                        <div className="flex flex-col">
                          <label
                            className={`font-bold tracking-wide text-sm ${
                              isDirty && "text-success"
                            }`}
                          >
                            Avatar Image
                          </label>
                          <ImageSelectDialog
                            position="avatar"
                            handleImageChange={handleImageChange}
                          >
                            <button
                              className={`btn-outline btn btn-square h-fit w-fit p-6 ${
                                isDirty && "btn-success"
                              }`}
                            >
                              <div className="overflow-hidden rounded-xl">
                                {value ? (
                                  <CldImage
                                    src={
                                      env.NEXT_PUBLIC_CLOUDINARY_FOLDER +
                                      "/" +
                                      value
                                    }
                                    alt="Avatar Image"
                                    width={158}
                                    height={158}
                                    className="rounded-xl object-center transition-all hover:scale-110"
                                    crop="thumb"
                                    gravity="face"
                                    placeholder="empty"
                                  />
                                ) : (
                                  <div className="flex h-40 w-40 flex-col place-content-center rounded-xl bg-base-300 text-center">
                                    None Selected
                                  </div>
                                )}
                              </div>
                            </button>
                          </ImageSelectDialog>
                        </div>
                      )}
                    </Field>

                    <div className="col-span-full mb-8">
                      <button
                        onClick={submit}
                        className={`btn btn-success btn-block ${
                          errors.length > 0 && "btn-disabled"
                        }`}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </Form>
            </div>
          </div>
        )}
        <div className="mt-4 flex flex-col gap-4 px-4">
          {data?.Blog && (
            <div className="flex flex-col gap-4">
              <h2 className="font-black  text-xl">
                {data?.Blog?.length > 0 ? "Blog Posts" : "No Blog Posts"}
              </h2>

              {data?.Blog?.map((blog) => (
                <div
                  key={blog.id}
                  className="grid grid-cols-6 rounded-lg bg-base-300 p-4 drop-shadow-2xl"
                >
                  <div className="col-span-5 mx-4 flex w-5/6  flex-col flex-wrap place-self-center ">
                    <span className="text-md font-medium">
                      <Link href={`/admin/blog/${blog?.id}`}>
                        <span className="link mr-1">{blog.title}</span>
                        {/* <span className="badge badge-primary">
                          <IoMdConstruct className="mr-2 " /> Edit
                        </span> */}
                      </Link>
                    </span>
                    <span className="text-xs">
                      Last updated:{" "}
                      {new Intl.DateTimeFormat(undefined, {
                        dateStyle: "long",
                        timeStyle: "short",
                      }).format(blog.updatedAt)}
                    </span>
                    <span className="text-xs">
                      Created:{" "}
                      {new Intl.DateTimeFormat(undefined, {
                        dateStyle: "long",
                        timeStyle: "short",
                      }).format(blog.createdAt)}
                    </span>
                  </div>
                  <div className="col-span-6 row-start-2 flex gap-2 place-self-center sm:col-auto sm:row-auto sm:flex-col ">
                    <button className="btn-outline btn btn-sm">
                      <IoMdConstruct className="mr-2" />
                      Edit
                    </button>
                    <button className="btn-outline btn btn-sm">
                      <IoMdTrash className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <div className="rounded-lg bg-base-300 p-4 drop-shadow-2xl">
                <Link href="/services/new">
                  <button className="btn btn-primary btn-block">
                    Create New Blog Post
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </>
    </div>
  );
};

export default ServiceEditor;

ServiceEditor.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
