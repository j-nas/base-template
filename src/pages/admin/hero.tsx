import { toast, Toaster } from "react-hot-toast";
import Breadcrumbs from "../../components/adminComponents/Breadcrumbs";
import LoadingSpinner from "../../components/LoadingSpinner";
import { api } from "../../utils/api";
import Layout from "../../components/adminComponents/Layout";
import { type ReactElement } from "react";
import { Form, Field, type FieldInstance, type FormInstance } from "houseform";
import ImageSelectDialog from "../../components/adminComponents/dialogs/ImageSelectDialog";
import { CldImage } from "next-cloudinary";
import { env } from "../../env/client.mjs";
import Link from "next/link";
import { z } from "zod";
import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { type HeroPosition } from "@prisma/client";

type FormData = {
  primaryImage: string;
  heading: string;
  ctaText: string;
};

export const HeroEditor = () => {
  const session = useSession();

  const [position, setPosition] = useState<HeroPosition>("FRONT");
  const primaryImageRef = useRef<FieldInstance>(null);
  const formRef = useRef<FormInstance>(null);

  const submitMutation = api.hero.update.useMutation();
  const { data: hero, isLoading } = api.hero.getByPosition.useQuery(
    {
      position,
    },
    { refetchOnMount: "always", cacheTime: 0 }
  );
  const ctx = api.useContext();

  if (!session.data?.user?.admin) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="font-bold text-2xl">
          You are not authorized to view this page
        </h1>
        <Link href="/admin/">
          <span className="text-primary">Go back to dashboard home</span>
        </Link>
      </div>
    );
  }

  const handleImageChange = (value: string) => {
    primaryImageRef.current?.setValue(value);
  };

  const handleSubmit = async (formData: FormData) => {
    const { primaryImage, ctaText, heading } = formData;
    const submission = {
      primaryImage,
      ctaText,
      heading,
      position: position,
    };
    await toast.promise(
      submitMutation.mutateAsync(submission, {
        onSuccess: async () => {
          await ctx.hero.invalidate();
          await ctx.hero.getByPosition.refetch({ position });
        },
        onError: (error) => {
          console.log(error);
          toast.error(error.message);
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

  return (
    <div className="relative flex h-full w-full flex-col place-items-center overflow-auto pb-12 scrollbar-thin scrollbar-track-base-200 scrollbar-thumb-primary scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg">
      <>
        <Toaster position="bottom-right" />
        {hero && <Breadcrumbs subName="About Us Editor" subPath="about" />}

        <div className="my-8">
          <h1 className=" place-self-center text-center font-black  text-2xl">
            Hero Banner Editor{" "}
          </h1>
          <div className="mx-auto flex w-52 flex-col">
            <label
              htmlFor="position"
              className="font-bold tracking-wide text-sm"
            >
              Position
            </label>
            <select
              id="position"
              placeholder="Select an position"
              value={position as string}
              className="select-bordered select select-sm"
              onChange={(e) => {
                setPosition(e.target.value as HeroPosition);
              }}
            >
              <option value={"FRONT"}>Front</option>
              <option value={"TOP"}>Top</option>
              <option value={"BOTTOM"}>Bottom</option>
            </select>
          </div>
          {isLoading && <LoadingSpinner />}
        </div>
        {hero && (
          <div>
            <div className="container flex  flex-col ">
              <Form
                onSubmit={(values) => handleSubmit(values as FormData)}
                ref={formRef}
              >
                {({ submit, errors }) => (
                  <>
                    <div className="= flex flex-wrap justify-center gap-6">
                      <Field<string>
                        name="heading"
                        initialValue={hero.heading}
                        onChangeValidate={z
                          .string()
                          .min(1, { message: "Required" })
                          .max(50, { message: "Max 150 characters" })}
                      >
                        {({ value, setValue, isDirty, errors }) => (
                          <div className="flex flex-col">
                            <label
                              className={`font-bold tracking-wide text-sm ${
                                errors.length > 0 ? "!text-error" : ""
                              } ${isDirty ? "text-success" : ""}`}
                            >
                              Heading Text
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
                              errors.map((e) => (
                                <span key={e} className="text-error">
                                  {e}
                                </span>
                              ))
                            ) : (
                              <span
                                className={`${isDirty ? "text-success" : ""}`}
                              >
                                {50 - value.length} characters remaining
                              </span>
                            )}
                          </div>
                        )}
                      </Field>
                      <Field<string>
                        name="ctaText"
                        initialValue={hero.ctaText}
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
                              Call To Action
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
                              errors.map((e) => (
                                <span key={e} className="text-error">
                                  {e}
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
                        initialValue={hero.primaryImage.public_id}
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
                                className={`btn-outline btn-square btn h-fit w-fit p-6 ${
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
                                    blurDataURL={hero.primaryImage.blur_url}
                                  />
                                </div>
                              </button>
                            </ImageSelectDialog>
                          </div>
                        )}
                      </Field>
                    </div>
                    <div className=" mt-6 place-self-center sm:w-auto  ">
                      <button
                        onClick={submit}
                        className={`btn-success btn w-[80vw] md:w-auto ${
                          errors.length > 0 ? "btn-disabled" : ""
                        }`}
                      >
                        Save Changes
                      </button>
                    </div>
                  </>
                )}
              </Form>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default HeroEditor;

HeroEditor.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
