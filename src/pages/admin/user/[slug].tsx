import { toast, Toaster } from "react-hot-toast";
import Breadcrumbs from "../../../components/adminComponents/Breadcrumbs";
import LoadingSpinner from "../../../components/LoadingSpinner";
import IconDisplay from "../../../components/IconDisplay";
import { api } from "../../../utils/api";
import { IoMdHelpCircle } from "react-icons/io";
import { useRouter } from "next/router";
import { Services } from "@prisma/client";
import { ParsedUrlQuery } from "querystring";
import Layout from "../../../components/adminComponents/Layout";
import { ReactElement } from "react";
import { Form, Field, FieldInstance, FormInstance } from "houseform";
import IconSelectDialog from "../../../components/adminComponents/dialogs/IconSelectDialog";
import ImageSelectDialog from "../../../components/adminComponents/dialogs/ImageSelectDialog";
import React from "react";
import { CldImage } from "next-cloudinary";
import { env } from "../../../env/client.mjs";
import Link from "next/link";
import ServiceContentEditor from "../../../components/adminComponents/TextEditor";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  const router = useRouter();
  const session = useSession();
  const queryId = router.query.slug as string;

  const superAdminMutation = api.user.update.useMutation();

  if (!session.data?.user?.superAdmin) {
    router.push(`/admin/user/me`);
    return (
      <div className="grid h-full w-full place-content-center font-bold text-2xl">
        Not Authorized, taking you to your profile.
      </div>
    );
  }

  const { isLoading, data, isError, error } = api.user.getById.useQuery({
    id: queryId,
  });

  if (isError) {
    return (
      <div className="grid h-full w-full place-content-center font-bold text-2xl">
        Error loading user. Check the URL and try again.
      </div>
    );
  }

  useEffect(() => {
    if (data?.avatarImage.public_id) {
      setAvatarImageExists(true);
    }
    return () => {
      setAvatarImageExists(false);
    };
  }, [data]);

  const ctx = api.useContext();
  const iconRef = React.useRef<FieldInstance>(null);
  const avatarImageRef = React.useRef<FieldInstance>(null);
  const contentRef = React.useRef<FieldInstance>(null);
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
      superAdminMutation.mutateAsync(
        { ...submission, avatarImageExists },
        {
          onSuccess: async () => {
            await ctx.user.invalidate();
            await ctx.user.getById.refetch({
              id: id,
            });
          },
          onError: async (error) => {
            console.log(error);
            toast.error(error.message);
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
  console.log(data);
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
          <span>
            avatar image exists: {avatarImageExists ? "true" : "false"}{" "}
          </span>

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
                                <span className="text-error text-xs">
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
                                <span className="text-error text-xs">
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
                              className={`btn btn-outline btn-square h-fit w-fit p-6 ${
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

                    <div className="col-span-full">
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
      </>
    </div>
  );
};

export default ServiceEditor;

ServiceEditor.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
