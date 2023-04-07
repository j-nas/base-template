import React, { type ReactElement, useState } from "react";
import Layout from "../../../components/adminComponents/Layout";
import { api } from "../../../utils/api";
import { IoMdAdd, IoMdConstruct, IoMdHelpCircle } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import Breadcrumbs from "../../../components/adminComponents/Breadcrumbs";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { type User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import AvatarDisplay from "../../../components/AvatarDisplay";
import UserRoleToggleDialog from "../../../components/adminComponents/dialogs/UserRoleToggleDialog";
import UserCreateDialog from "../../../components/adminComponents/dialogs/UserCreateDialog";
import UserDeleteDialog from "../../../components/adminComponents/dialogs/UserDeleteDialog";
export const UserManager = () => {
  const [isToggling, setIsToggling] = useState(false);
  const router = useRouter();
  const session = useSession();

  const { isLoading, data: users } = api.user.getAll.useQuery();
  const [parent] = useAutoAnimate();
  const ctx = api.useContext();

  const toggleAdminMutation = api.user.toggleAdmin.useMutation();
  const createUserMutation = api.user.create.useMutation();
  const deleteUserMutation = api.user.delete.useMutation();

  if (!session.data?.user?.superAdmin) {
    void router.push(`/admin/user/me`);
    return (
      <div className="grid h-full w-full place-content-center font-bold text-2xl">
        Not Authorized
      </div>
    );
  }

  const canEdit = (user: User) => {
    if (user.id === session.data?.user?.id) return true;
    if (user.superAdmin) return false;
    return true;
  };

  const handleToggleAdmin = async (user: User) => {
    if (user.superAdmin) return;
    setIsToggling(true);
    await toast.promise(
      toggleAdminMutation.mutateAsync(
        {
          id: user.id,
          admin: !user.admin,
        },
        {
          onSuccess: async () => {
            setIsToggling(false);

            await ctx.user.getAll.refetch();
          },
          onError: (error) => {
            console.error(error);
            setIsToggling(false);
            return "Error updating user";
          },
        }
      ),
      {
        loading: "Updating user",
        success: "User's role changed. User will be logged out.",
        error: "Error updating user",
      }
    );
  };
  const handleUserCreate = async (name: string, email: string) => {
    await toast.promise(
      createUserMutation.mutateAsync(
        {
          name,
          email,
        },
        {
          onSuccess: async () => {
            await ctx.user.getAll.refetch();
          },
          onError: (error) => {
            console.error(error);
            return "Error adding user";
          },
        }
      ),
      {
        loading: "Creating user",
        success: `User ${name} created.`,
        error: "Error adding user",
      }
    );
  };
  const handleUserDelete = async (user: User) => {
    if (user.superAdmin) return;
    await toast.promise(
      deleteUserMutation.mutateAsync(
        { id: user.id },
        {
          onSuccess: async () => {
            await ctx.user.getAll.refetch();
          },
          onError: (error) => {
            console.error(error);
          },
        }
      ),
      {
        loading: "Deleting user",
        success: `User deleted.`,
        error: "Error deleting user",
      }
    );
  };

  return (
    <div className="relative flex h-full w-full flex-col place-items-center overflow-auto pb-12 scrollbar-thin scrollbar-track-base-100 scrollbar-thumb-primary scrollbar-track-rounded-lg">
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Breadcrumbs subName="Services Manager" subPath="services" />
      <div>
        <h1 className="my-6 place-self-center text-center font-black  text-2xl">
          Users Managment{" "}
          <span
            className="tooltip tooltip-left"
            data-tip="On this page you can swap the position of your offered services as they appear on the home page. The service in position 1 is featured on the landing page, while the first 3 positions show short summaries just below the hero image."
          >
            <IoMdHelpCircle />
          </span>
        </h1>
        {isLoading && <LoadingSpinner />}
        <div
          ref={parent}
          className="ml-6 flex w-auto flex-wrap place-content-stretch  gap-6"
        >
          {users
            ?.sort((a, b) => a.name?.localeCompare(b.name))
            .map((user) => (
              <div
                key={user.id}
                className={`flex w-72 flex-col rounded-lg bg-base-300 p-4 drop-shadow-2xl ${
                  (user.id === session.data?.user?.id &&
                    "shadow-lg shadow-primary outline outline-2 outline-primary") ||
                  ""
                }`}
              >
                <div className="mb-6 flex">
                  <div className=" flex place-items-center">
                    <AvatarDisplay
                      name={user.name || ""}
                      public_id={user.avatarImage}
                      size={10}
                    />
                  </div>
                  <div className="mx-4 flex min-w-fit flex-col place-self-center">
                    <span className="text-md font-medium">
                      {canEdit(user) ? (
                        <Link href={`user/${user?.id}`}>
                          <span className="text-md link  mr-1">
                            {user.name}
                          </span>
                        </Link>
                      ) : (
                        <span className="text-md   mr-1">{user.name}</span>
                      )}
                    </span>
                    <span className="text-xs">
                      {user.superAdmin
                        ? "Site Administrator"
                        : user.admin
                        ? "Content Administrator"
                        : "Contributor"}
                    </span>
                  </div>
                </div>

                <div className="p btn-group btn-group-vertical gap-1">
                  <div
                    className={`${
                      (user.superAdmin && "pointer-events-none") || ""
                    } flex flex-col`}
                  >
                    <UserRoleToggleDialog
                      user={user}
                      handleToggleAdmin={handleToggleAdmin}
                    >
                      <div
                        className={`btn-outline btn btn-sm w-full ${
                          (user.superAdmin && "btn-disabled ") || ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={user.id}
                          className="checkbox checkbox-sm"
                          disabled={user.superAdmin || isToggling}
                          checked={user.admin}
                          readOnly
                        ></input>
                        <span className="ml-2 text-xs">Toggle Admin</span>
                      </div>
                    </UserRoleToggleDialog>
                  </div>
                  <div className="flex flex-col">
                    <Link
                      href={`/admin/user/${user?.id}`}
                      className={`btn-outline btn btn-sm ${
                        canEdit(user) ? "" : "btn-disabled "
                      }`}
                    >
                      <IoMdConstruct className="mr-2 text-lg" /> Edit Profile
                    </Link>
                  </div>
                  <div
                    className={`flex flex-col ${
                      (user.superAdmin && "pointer-events-none") || ""
                    }`}
                  >
                    <UserDeleteDialog
                      user={user}
                      handleUserDelete={handleUserDelete}
                    >
                      <div
                        className={`btn-outline btn btn-error btn-block btn-sm ${
                          (user.superAdmin && "!btn-disabled ") || ""
                        }`}
                      >
                        <MdDeleteOutline className="mr-2 text-lg" />
                        Delete User
                      </div>
                    </UserDeleteDialog>
                  </div>
                </div>
              </div>
            ))}
          {!isLoading && (
            <div className="flex max-h-20 w-72 flex-col place-content-center rounded-lg bg-base-300 p-4 drop-shadow-2xl">
              <UserCreateDialog handleUserCreate={handleUserCreate}>
                <div className="btn btn-xl btn-primary btn-block">
                  <IoMdAdd className="mr-2 text-xl" />
                  Add User
                </div>
              </UserCreateDialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManager;

UserManager.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
