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
import { Form, Field, FieldInstance, FormInstance } from "houseform";
import IconSelectDialog from "../../../components/adminComponents/IconSelectDialog";
import React from "react";
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

  const iconRef = React.useRef<FieldInstance>(null);
  const handleIconChange = (value: string) => {
    iconRef.current?.setValue(value);
  };
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
        {data && (
          <div>
            <div className="flex h-full w-full flex-col">
              <Form>
                {({ submit }) => (
                  <Field name="icon" initialValue={data?.icon} ref={iconRef}>
                    {({ value, setValue, isDirty }) => (
                      <div className="flex flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm ${
                            isDirty && "text-success"
                          }`}
                        >
                          Icon
                        </label>
                        <IconSelectDialog handleIconChange={handleIconChange}>
                          <button
                            className={`btn-outline btn-square btn ${
                              isDirty && "btn-success"
                            }`}
                          >
                            <IconDisplay icon={value} />
                          </button>
                        </IconSelectDialog>
                      </div>
                    )}
                  </Field>
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
