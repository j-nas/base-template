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

export const BlogManager = () => {
  const { isLoading, data: services } = api.service.getAllAdmin.useQuery();
  const swapMutation = api.service.swapPosition.useMutation();
  const [parent, enableAnimations] = useAutoAnimate();
  const ctx = api.useContext();

  return (
    <div className="relative flex h-full w-full flex-col place-items-center overflow-auto">
      <Toaster position="bottom-right" />
      <Breadcrumbs subName="Services Manager" subPath="services" />
      <div>
        <h1 className="my-6 place-self-center text-center font-black  text-2xl">
          Services Managment{" "}
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
          {services
            ?.sort((a: any, b: any) => a.position.localeCompare(b.position))
            .map((service) => (
              <div
                key={service.id}
                className="flex  rounded-lg bg-base-300 p-4 drop-shadow-2xl"
              >
                <div className=" flex place-items-center">
                  <IconDisplay icon={service.icon} />
                </div>
                <div className="mx-4 flex min-w-fit flex-col place-self-center">
                  <span className="text-md font-medium">
                    {service.position && (
                      <Link
                        href={`services/${service?.position.toLowerCase()}`}
                      >
                        <span className="link mr-1">{service.title}</span>
                        <span className="badge-primary badge">
                          <IoMdConstruct className="mr-2 " /> Edit
                        </span>
                      </Link>
                    )}
                  </span>
                  <span className="text-xs">
                    Last updated:{" "}
                    {new Intl.DateTimeFormat(undefined, {
                      dateStyle: "long",
                      timeStyle: "short",
                    }).format(service.updatedAt)}
                  </span>
                </div>
                {/* <span>{service.position}</span> */}

                <div className="flex w-1/2 flex-col place-content-center place-self-end">
                  <select
                    id={service.id}
                    className="btn btn-primary btn-sm ml-2 place-self-start px-1"
                    // defaultValue={service.position as string}
                    onChange={(e) =>
                      handleSwap(
                        service.position as Services,
                        e.target.value as Services
                      )
                    }
                    value={service.position as string}
                    disabled={isSwapping}
                  >
                    {servicePositions.map((position) => (
                      <option key={position.value} value={position.value}>
                        {position.label}
                      </option>
                    ))}
                  </select>
                  <label htmlFor={service.id}>
                    <span className="text-xs">Position</span>
                  </label>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BlogManager;

BlogManager.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
