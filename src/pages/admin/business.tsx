import { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import { Layout } from "../../components/AdminComponents";
import { api } from "../../utils/api";
import z from "zod";
import InputWrapper from "../../components/adminComponents/InputWrapper";
import { Field, Form, type FormInstance } from "houseform";
import LoadingSpinner from "../../components/LoadingSpinner";
import React from "react";
import { RouterOutputs } from "../../utils/api";
import { Toaster, toast } from "react-hot-toast";
import Breadcrumbs from "../../components/adminComponents/Breadcrumbs";
import { useSession } from "next-auth/react";
import Link from "next/link";

const provinces = [
  "AB",
  "BC",
  "MB",
  "NB",
  "NL",
  "NS",
  "NT",
  "NU",
  "ON",
  "PE",
  "QC",
  "SK",
  "YT",
];

export const BusinessProfile: NextPageWithLayout = () => {
  const session = useSession();

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

  const { data, isLoading } = api.businessInfo.getActiveWithDateTime.useQuery();
  const updateMutation = api.businessInfo.update.useMutation();
  const formRef = React.useRef<FormInstance>(null);
  const ctx = api.useContext();
  console.log(formRef.current?.errors);

  const handleSubmit = async (
    formData: RouterOutputs["businessInfo"]["getActiveWithDateTime"]
  ) => {
    console.log(formData);
    toast.promise(
      updateMutation.mutateAsync(
        { ...formData, id: data?.id ?? "" },
        {
          onSuccess: () => {
            formRef.current?.setIsDirty(false);
            ctx.businessInfo.getActiveWithDateTime.refetch();
          },
          onError: (error) => {
            console.log(error);
            toast.error(error.message);
          },
        }
      ),
      {
        loading: "Updating...",
        success: "Updated!",
        error: "Error updating",
      }
    );
  };
  return (
    <div className="grid h-full w-full grid-rows-[max-content_1fr]  place-items-center ">
      <Toaster position="bottom-right" />
      <Breadcrumbs subName="Business Profile" subPath="business" />
      <div className="">
        <h1 className="p-8 text-4xl">Business Profile</h1>
      </div>
      {isLoading && <LoadingSpinner />}
      {data && (
        <div className="p-4">
          <Form
            ref={formRef}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
          >
            {({ submit, errors }) => (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex w-full flex-col place-items-stretch">
                  <InputWrapper
                    label="Business Name"
                    name="title"
                    initialValue={data.title}
                    zodValidate={z
                      .string()
                      .min(1, { message: "Please enter your business name" })
                      .max(30, {
                        message: "Please limit business name to 30 characters",
                      })}
                  />
                  <InputWrapper
                    label="Address"
                    name="address"
                    initialValue={data.address}
                    zodValidate={z
                      .string()
                      .min(1, { message: "Please enter your address" })
                      .max(100, {
                        message: "Please limit adress to 100 characters",
                      })}
                  />
                  <InputWrapper
                    label="City"
                    name="city"
                    initialValue={data.city}
                    zodValidate={z
                      .string()
                      .min(1, { message: "Please enter your city" })
                      .max(30, {
                        message: "Please limit city name to 30 characters",
                      })}
                  />
                  <Field name="province" initialValue={data.province}>
                    {({ value, setValue, onBlur }) => (
                      <div className="form-control place-self-stretch md:place-self-auto">
                        <label className="label">
                          <span className="label-text">Province</span>
                        </label>
                        <select
                          className="select-bordered select  "
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          onBlur={onBlur}
                        >
                          {provinces.map((province) => (
                            <option key={province} value={province}>
                              {province}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </Field>
                  <InputWrapper
                    label="Postal Code"
                    name="postalCode"
                    initialValue={data.postalCode}
                    zodValidate={z
                      .string()
                      .min(1, { message: "Please enter your postal code" })
                      .max(7, {
                        message: "Please enter a valid postal code",
                      })}
                  />
                  <InputWrapper
                    label="Phone"
                    name="telephone"
                    initialValue={data.telephone}
                    zodValidate={z
                      .string()
                      .min(1, { message: "Please enter your phone number" })
                      .max(12, {
                        message: "Please enter a valid phone number",
                      })}
                  />
                  <InputWrapper
                    label="Email"
                    name="email"
                    initialValue={data.email}
                    zodValidate={z
                      .string()
                      .min(1, { message: "Please enter your email" })
                      .email({ message: "Please enter a valid email" })}
                  />
                  <InputWrapper
                    label="Holidays"
                    name="holidays"
                    initialValue={data.holidays}
                    tooltip='Enter the holidays for your business, as they would appear on the site. For example: "Closed on all statutory holidays"'
                    zodValidate={z
                      .string()
                      .min(1, { message: "Please enter your holidays" })
                      .max(50, {
                        message: "Please limit holidays to 50 characters",
                      })}
                  />
                  <InputWrapper
                    label="Hours of operation"
                    name="hours"
                    initialValue={data.hours}
                    tooltip='Enter the hours of operation for your business, as they would appear on the site. For example: "Monday to Friday 9:00am to 5:00pm"'
                    zodValidate={z
                      .string()
                      .min(1, { message: "Please enter your hours" })
                      .max(50, {
                        message: "Please limit hours to 50 characters",
                      })}
                  />
                  <InputWrapper
                    label="Owner Name"
                    name="ownerName"
                    initialValue={data.ownerName}
                    zodValidate={z
                      .string()
                      .min(1, { message: "Please enter your name" })
                      .max(30, {
                        message: "Please limit name to 30 characters",
                      })}
                  />
                  <InputWrapper
                    label="Owner Quote"
                    name="ownerQuote"
                    initialValue={data.ownerQuote}
                    zodValidate={z
                      .string()
                      .min(1, { message: "Please enter your quote" })
                      .max(100, {
                        message: "Please limit quote to 100 characters",
                      })}
                  />
                  <InputWrapper
                    label="Owner Title"
                    name="ownerTitle"
                    initialValue={data.ownerTitle}
                    zodValidate={z
                      .string()
                      .min(1, { message: "Please enter your title" })
                      .max(30, {
                        message: "Please limit title to 30 characters",
                      })}
                  />
                </div>
                <div className="flex w-full flex-col place-items-stretch">
                  <InputWrapper
                    label="Facebook Page URL"
                    name="facebookUrl"
                    initialValue={data.facebookUrl ?? undefined}
                    tooltip="Enter the URL of your Facebook page. For example: https://www.facebook.com/yourbusiness. Leave blank if you do not have a Facebook page."
                    zodValidate={z.string().optional()}
                  />
                  <InputWrapper
                    label="Instagram Page URL"
                    name="instagramUrl"
                    initialValue={data.instagramUrl ?? undefined}
                    tooltip="Enter the URL of your Instagram page. For example: https://www.instagram.com/yourbusiness. Leave blank if you do not have an Instagram page."
                    zodValidate={z.string().optional()}
                  />
                  <InputWrapper
                    label="Twitter Page URL"
                    name="twitterUrl"
                    initialValue={data.twitterUrl ?? undefined}
                    tooltip="Enter the URL of your Twitter page. For example: https://www.twitter.com/yourbusiness. Leave blank if you do not have a Twitter page."
                    zodValidate={z.string().optional()}
                  />
                  <InputWrapper
                    label="LinkedIn Page URL"
                    name="linkedInUrl"
                    initialValue={data.linkedInUrl ?? undefined}
                    tooltip="Enter the URL of your LinkedIn page. For example: https://www.linkedin.com/yourbusiness. Leave blank if you do not have a LinkedIn page."
                    zodValidate={z.string().optional()}
                  />
                  <InputWrapper
                    label="YouTube Page URL"
                    name="youtubeUrl"
                    initialValue={data.youtubeUrl ?? undefined}
                    tooltip="Enter the URL of your YouTube page. For example: https://www.youtube.com/yourbusiness. Leave blank if you do not have a YouTube page."
                    zodValidate={z.string().optional()}
                  />
                  <InputWrapper
                    label="Pinterest Page URL"
                    name="pinterestUrl"
                    initialValue={data.pinterestUrl ?? undefined}
                    tooltip="Enter the URL of your Pinterest page. For example: https://www.pinterest.com/yourbusiness. Leave blank if you do not have a Pinterest page."
                    zodValidate={z.string().optional()}
                  />
                  <InputWrapper
                    label="TikTok Page URL"
                    name="tiktokUrl"
                    initialValue={data.tiktokUrl ?? undefined}
                    tooltip="Enter the URL of your TikTok page. For example: https://www.tiktok.com/yourbusiness. Leave blank if you do not have a TikTok page."
                    zodValidate={z.string().optional()}
                  />
                  <InputWrapper
                    label="Snapchat Page URL"
                    name="snapchatUrl"
                    initialValue={data.snapchatUrl ?? undefined}
                    tooltip="Enter the URL of your Snapchat page. For example: https://www.snapchat.com/yourbusiness. Leave blank if you do not have a Snapchat page."
                    zodValidate={z.string().optional()}
                  />
                  <InputWrapper
                    label="WhatsApp Page URL"
                    name="whatsappUrl"
                    initialValue={data.whatsappUrl ?? undefined}
                    tooltip="Enter the URL of your WhatsApp page. For example: https://www.whatsapp.com/yourbusiness. Leave blank if you do not have a WhatsApp page."
                    zodValidate={z.string().optional()}
                  />
                </div>
                <div className="col-span-full row-start-2">
                  <button
                    className={`btn btn-success btn-block mt-6 mb-2 ${
                      errors.length > 0 && "btn-disabled"
                    }`}
                    onClick={submit}
                    type="button"
                  >
                    Save Changes
                  </button>
                  <div>
                    {errors && (
                      <div className="mb-12 text-red-500 text-xs">
                        {errors.map((error, i) => (
                          <div key={error + i}>{error}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Form>
        </div>
      )}
    </div>
  );
};

export default BusinessProfile;

BusinessProfile.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
