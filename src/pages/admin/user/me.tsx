import { toast, Toaster } from "react-hot-toast";
import Breadcrumbs from "../../../components/adminComponents/Breadcrumbs";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { api } from "../../../utils/api";
import { IoMdHelpCircle } from "react-icons/io";
import Layout from "../../../components/adminComponents/Layout";
import { type ReactElement } from "react";
import { type FormInstance } from "houseform";
import React from "react";
import { useState, useEffect } from "react";
import UserProfile, {
  type FormData,
} from "../../../components/adminComponents/UserProfile";
import BlogListing from "../../../components/adminComponents/BlogListing";

export const UserEditor = () => {
  const [avatarImageExists, setAvatarImageExists] = useState(false);

  const userUpdateMutation = api.user.update.useMutation();

  const { isLoading, data, isError } = api.user.getSelf.useQuery();

  useEffect(() => {
    if (data?.avatarImage?.public_id) {
      setAvatarImageExists(true);
    }
    return () => {
      setAvatarImageExists(false);
    };
  }, [data]);

  const ctx = api.useContext();
  const formRef = React.useRef<FormInstance>(null);

  if (isError) {
    return (
      <div className="grid h-full w-full place-content-center font-bold text-2xl">
        Error loading user. Check the URL and try again.
      </div>
    );
  }

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
          onError: (error) => {
            console.error(error);
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
          <UserProfile user={data} handleSubmit={handleSubmit} ref={formRef} />
        )}
        {data?.Blog && (
          <BlogListing
            blogs={data?.Blog}
            user={{
              avatar: data.avatarImage?.public_id,
              id: data.id,
              name: data.name,
            }}
          />
        )}
      </>
    </div>
  );
};

export default UserEditor;

UserEditor.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
