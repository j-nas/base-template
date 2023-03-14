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
import ImageSelectDialog from "../../../components/adminComponents/ImageSelectDialog";
import React from "react";
import { CldImage } from "next-cloudinary";
import { env } from "../../../env/client.mjs";
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
  const primaryImageRef = React.useRef<FieldInstance>(null);
  const secondaryImageRef = React.useRef<FieldInstance>(null);

  const handleIconChange = (value: string) => {
    iconRef.current?.setValue(value);
  };
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
  return (
    <div className="scroll-bar-thumb-primary relative flex h-full w-full flex-col place-items-center overflow-auto pb-12 scrollbar-thin scrollbar-track-base-200 scrollbar-track-rounded-lg">
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
            <div className="flex h-full w-full flex-wrap justify-center gap-4">
              <Form>
                {({ submit }) => (
                  <React.Fragment>
                    <div className="flex flex-col">
                      <Field
                        name="icon"
                        initialValue={data?.icon}
                        ref={iconRef}
                      >
                        {({ value, setValue, isDirty }) => (
                          <div className="flex flex-col">
                            <label
                              className={`font-bold tracking-wide text-sm ${
                                isDirty && "text-success"
                              }`}
                            >
                              Icon
                            </label>
                            <IconSelectDialog
                              handleIconChange={handleIconChange}
                            >
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
                      <Field name="title" initialValue={data.title}>
                        {({ value, setValue, isDirty }) => (
                          <div className="flex flex-col">
                            <label
                              className={`font-bold tracking-wide text-sm ${
                                isDirty && "text-success"
                              }`}
                            >
                              Title
                            </label>
                            <input
                              className={`input-bordered input ${
                                isDirty && "input-success"
                              }`}
                              value={value}
                              onChange={(e) => setValue(e.target.value)}
                            />
                          </div>
                        )}
                      </Field>
                    </div>
                    <Field
                      name="description"
                      initialValue={data.shortDescription}
                    >
                      {({ value, setValue, isDirty }) => (
                        <div className="flex flex-col">
                          <label
                            className={`font-bold tracking-wide text-sm ${
                              isDirty && "text-success"
                            }`}
                          >
                            Description
                          </label>
                          <textarea
                            className={`textarea-bordered textarea  resize-none scrollbar-thin ${
                              isDirty && "input-success"
                            }`}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            rows={5}
                            maxLength={150}
                          />
                          {value.length}/150 Max characters
                        </div>
                      )}
                    </Field>
                    <Field
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
                            <button className="btn-outline btn-square btn h-fit w-fit p-6">
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
                    <Field
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
                            <button className="btn-outline btn-square btn h-fit w-fit p-6 ">
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
