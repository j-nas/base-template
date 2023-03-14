import { toast, Toaster } from "react-hot-toast";
import Breadcrumbs from "../../../components/adminComponents/Breadcrumbs";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import IconDisplay from "../../../components/IconDisplay";
import { api } from "../../../utils/api";
import { IoMdHelpCircle } from "react-icons/io";
import { prisma } from "../../../server/db";
import { GetStaticPropsContext } from "next/types";
import { useRouter } from "next/router";
import { Services } from "@prisma/client";
import { createInnerTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { ParsedUrlQuery } from "querystring";
import Layout from "../../../components/adminComponents/Layout";
import { ReactElement } from "react";

export interface ServicePageQuery extends ParsedUrlQuery {
  slug: Services;
}

export const ServiceEditor = () => {
  const router = useRouter();
  const servicePage = router.query.slug as string;
  const servicePageFormatted = servicePage.toUpperCase() as Services;

  const { data: data, isLoading } = api.service.getByPosition.useQuery({
    position: servicePageFormatted,
  });
  console.log(data);

  return (
    <div className="relative flex h-full w-full flex-col place-items-center overflow-auto">
      <>
        <Toaster position="bottom-right" />
        {data && (
          <Breadcrumbs
            subName="Services Manager"
            subPath="services"
            subSubName={data.title}
          />
        )}

        <div>
          <h1 className="my-6 place-self-center text-center font-black  text-2xl">
            {data?.title}{" "}
            <span className="tooltip tooltip-left">
              <IoMdHelpCircle />
            </span>
          </h1>
          {isLoading && <LoadingSpinner />}
        </div>
        <div>
          <div className="flex h-full w-full flex-col">hello</div>
        </div>
      </>
    </div>
  );
};

export default ServiceEditor;

ServiceEditor.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
