import React, { type ReactElement, useState } from "react";
import { Layout } from "../../../components/AdminComponents";
import { api } from "../../../utils/api";
import { IoMdConstruct, IoMdHelpCircle } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import Breadcrumbs from "../../../components/adminComponents/Breadcrumbs";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import IconDisplay from "../../../components/IconDisplay";
import { Services } from "@prisma/client";
import Link from "next/link";
import Tooltip from "../../../components/Tooltip";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import AvatarDisplay from "../../../components/AvatarDisplay";

export const ServiceManager = () => {
  const router = useRouter();
  const session = useSession();
  if (session.data?.user?.admin !== true) {
    router.push(`/admin/user/${session.data?.user?.id}`);
  }
  const { isLoading, data: users } = api.user.getAll.useQuery();
  const [parent, enableAnimations] = useAutoAnimate();
  const ctx = api.useContext();

  return (
    <div className="relative flex h-full w-full flex-col place-items-center overflow-auto">
      <Toaster position="bottom-right" />
      <Breadcrumbs subName="Services Manager" subPath="services" />
      <div>
        <h1 className="my-6 place-self-center text-center font-black  text-2xl">
          Users Managment{" "}
          <span
            className="tooltip tooltip-left"
            data-tip="On this page you can swap the position of your offered services as they appear on the home page. The service in position 1 has a short summary featured on the landing page, while the first 3 positions are shown just below the hero image."
          >
            <IoMdHelpCircle />
          </span>
        </h1>
        {isLoading && <LoadingSpinner />}
        <div
          ref={parent}
          className="flex w-full flex-col items-center justify-center gap-6"
        >
          {users?.map((user) => (
            <div
              key={user.id}
              className="flex  rounded-lg bg-base-300 p-4 drop-shadow-2xl"
            >
              <div className=" flex place-items-center">
                <AvatarDisplay
                  name={user.name || ""}
                  public_id={user.avatarImage}
                  size={"10"}
                />
              </div>
              <div className="mx-4 flex min-w-fit flex-col place-self-center">
                <span className="text-md font-medium">
                  {user.id && (
                    <Link href={`user/${user?.id}`}>
                      <span className="link mr-1">{user.name}</span>
                      <span className="badge-primary badge">
                        <IoMdConstruct className="mr-2 " /> Edit
                      </span>
                    </Link>
                  )}
                </span>
                <span className="text-xs">Last updated: </span>
              </div>
              {/* <span>{user.position}</span> */}

              <div className="flex w-1/2 flex-col place-content-center place-self-end">
                <input type="checkbox" />
                <label htmlFor={user.id}>
                  <span className="text-xs">Admin</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceManager;

ServiceManager.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
