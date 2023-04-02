import React, { type ReactElement } from "react";
import { useSession } from "next-auth/react";
import { Field, Form, type FormInstance } from "houseform";
import { Toaster, toast } from "react-hot-toast";
import { IoMdHelpCircle } from "react-icons/io";
import z from "zod";
import { type NextPageWithLayout } from "../_app";
import { api, type RouterOutputs } from "~/utils/api";
import LoadingSpinner from "@/LoadingSpinner";
import Layout from "@/adminComponents/Layout";
import Breadcrumbs from "@/adminComponents/Breadcrumbs";
import NotAuthorized from "@/adminComponents/NotAuthorized";

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

type FormData = RouterOutputs["businessInfo"]["getActiveWithDateTime"];

export const BusinessProfile: NextPageWithLayout = () => {
  const session = useSession();

  const { data, isLoading } = api.businessInfo.getActiveWithDateTime.useQuery();
  const updateMutation = api.businessInfo.update.useMutation();
  const formRef = React.useRef<FormInstance>(null);
  const ctx = api.useContext();

  if (!session.data?.user?.admin) {
    return <NotAuthorized />;
  }

  const handleSubmit = async (formData: FormData) => {
    console.log(formData);
    await toast.promise(
      updateMutation.mutateAsync(
        { ...formData, id: data?.id ?? "" },
        {
          onSuccess: async () => {
            formRef.current?.setIsDirty(false);
            await ctx.businessInfo.getActiveWithDateTime.refetch();
          },
          onError: (error) => {
            console.log(error);
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
        <h1 className="my-6 place-self-center text-center font-black  text-2xl">
          Business Profile
        </h1>
      </div>
      {isLoading && <LoadingSpinner />}
      {data && (
        <div className="p-4">
          <Form
            ref={formRef}
            onSubmit={(values) => {
              void handleSubmit(values as FormData);
            }}
          >
            {({ submit, errors }) => (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex w-full flex-col place-items-stretch">
                  <Field<string>
                    name="title"
                    initialValue={data.title}
                    onChangeValidate={z
                      .string()
                      .min(1, { message: "Please enter your business name" })
                      .max(30, {
                        message: "Please limit business name to 30 characters",
                      })}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          Business Name
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
                              {error}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>
                  <Field<string>
                    name="address"
                    initialValue={data.address}
                    onChangeValidate={z
                      .string()
                      .min(1, { message: "Please enter your address" })
                      .max(100, {
                        message: "Please limit adress to 100 characters",
                      })}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          Address
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
                              {error}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>
                  <Field<string>
                    name="city"
                    initialValue={data.city}
                    onChangeValidate={z
                      .string()
                      .min(1, { message: "Please enter your city" })
                      .max(30, {
                        message: "Please limit city name to 30 characters",
                      })}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          City
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
                              {error}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>
                  <Field<string> name="province" initialValue={data.province}>
                    {({ value, setValue, onBlur }) => (
                      <div className="form-control place-self-stretch md:place-self-auto">
                        <label className="font-bold tracking-wide text-sm">
                          Province
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
                  <Field<string>
                    name="postalCode"
                    initialValue={data.postalCode}
                    onChangeValidate={z
                      .string()
                      .min(1, { message: "Please enter your postal code" })
                      .max(7, {
                        message: "Please enter a valid postal code",
                      })}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          Postal Code
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
                              {error}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>
                  <Field<string>
                    name="telephone"
                    initialValue={data.telephone}
                    onChangeValidate={z
                      .string()
                      .min(1, { message: "Please enter your phone number" })
                      .max(12, {
                        message: "Please enter a valid phone number",
                      })}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          Telephone
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
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
                      .min(1, { message: "Please enter your email" })
                      .email({ message: "Please enter a valid email" })}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          Email
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
                              {error}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>
                  <Field<string>
                    name="holidays"
                    initialValue={data.holidays}
                    onChangeValidate={z
                      .string()
                      .min(1, { message: "Please enter your holidays" })
                      .max(50, {
                        message: "Please limit holidays to 50 characters",
                      })}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          Holidays
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
                              {error}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>
                  <Field<string>
                    name="hours"
                    initialValue={data.hours}
                    onChangeValidate={z
                      .string()
                      .min(1, { message: "Please enter your hours" })
                      .max(50, {
                        message: "Please limit hours to 50 characters",
                      })}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          Hours
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
                              {error}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>
                  <Field<string>
                    name="ownerName"
                    initialValue={data.ownerName}
                    onChangeValidate={z
                      .string()
                      .min(1, { message: "Please enter your name" })
                      .max(30, {
                        message: "Please limit name to 30 characters",
                      })}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          Owner Name
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
                              {error}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>
                  <Field<string>
                    name="ownerQuote"
                    initialValue={data.ownerQuote}
                    onChangeValidate={z
                      .string()
                      .min(1, { message: "Please enter your quote" })
                      .max(100, {
                        message: "Please limit quote to 100 characters",
                      })}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          Owner Quote
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
                              {error}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>
                  <Field<string>
                    name="ownerTitle"
                    initialValue={data.ownerTitle}
                    onChangeValidate={z
                      .string()
                      .min(1, { message: "Please enter your title" })
                      .max(30, {
                        message: "Please limit title to 30 characters",
                      })}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          Owner Title
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
                              {error}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>
                </div>
                <div className="flex w-full flex-col place-items-stretch">
                  <Field<string>
                    name="facebookUrl"
                    initialValue={data.facebookUrl ?? undefined}
                    onChangeValidate={z.string().optional()}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          Facebook URL
                          <span
                            className="tooltip"
                            data-tip="Enter the URL of your Facebook page. For example: https://www.facebook.com/yourbusiness. Leave blank if you do not have a Facebook page."
                          >
                            <IoMdHelpCircle />
                          </span>
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
                              {error}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>
                  <Field<string>
                    name="instagramUrl"
                    initialValue={data.instagramUrl ?? undefined}
                    onChangeValidate={z.string().optional()}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          Instagram URL
                          <span
                            className="tooltip"
                            data-tip="Enter the URL of your Instagram page. For example: https://www.instagram.com/yourbusiness. Leave blank if you do not have an Instagram page."
                          >
                            <IoMdHelpCircle />
                          </span>
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
                              {error}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>
                  <Field<string>
                    name="twitterUrl"
                    initialValue={data.twitterUrl ?? undefined}
                    onChangeValidate={z.string().optional()}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          Twitter URL
                          <span
                            className="tooltip"
                            data-tip="Enter the URL of your Twitter page. For example: https://www.twitter.com/yourbusiness. Leave blank if you do not have a Twitter page."
                          >
                            <IoMdHelpCircle />
                          </span>
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
                              {error}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>
                  <Field<string>
                    name="linkedInUrl"
                    initialValue={data.linkedInUrl ?? undefined}
                    onChangeValidate={z.string().optional()}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          LinkedIn URL
                          <span
                            className="tooltip"
                            data-tip="Enter the URL of your LinkedIn page. For example: https://www.linkedIn.com/yourbusiness. Leave blank if you do not have a LinkedIn page."
                          >
                            <IoMdHelpCircle />
                          </span>
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
                              {error}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>
                  <Field<string>
                    name="youtubeUrl"
                    initialValue={data.youtubeUrl ?? undefined}
                    onChangeValidate={z.string().optional()}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          YouTube URL
                          <span
                            className="tooltip"
                            data-tip="Enter the URL of your YouTube page. For example: https://www.youtube.com/yourbusiness. Leave blank if you do not have a YouTube page."
                          >
                            <IoMdHelpCircle />
                          </span>
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
                              {error}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>
                  <Field<string>
                    name="pinterestUrl"
                    initialValue={data.pinterestUrl ?? undefined}
                    onChangeValidate={z.string().optional()}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          Pintrest URL
                          <span
                            className="tooltip"
                            data-tip="Enter the URL of your Pintrest page. For example: https://www.pintrest.com/yourbusiness. Leave blank if you do not have a Pintrest page."
                          >
                            <IoMdHelpCircle />
                          </span>
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
                              {error}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>
                  <Field<string>
                    name="tiktokUrl"
                    initialValue={data.tiktokUrl ?? undefined}
                    onChangeValidate={z.string().optional()}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          Tiktok URL
                          <span
                            className="tooltip"
                            data-tip="Enter the URL of your Tiktok page. For example: https://www.tiktok.com/yourbusiness. Leave blank if you do not have a Tiktok page."
                          >
                            <IoMdHelpCircle />
                          </span>
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
                              {error}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>
                  <Field<string>
                    name="snapchatUrl"
                    initialValue={data.snapchatUrl ?? undefined}
                    onChangeValidate={z.string().optional()}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          Snapchat URL
                          <span
                            className="tooltip"
                            data-tip="Enter the URL of your Snapchat page. For example: https://www.snapchat.com/yourbusiness. Leave blank if you do not have a Snapchat page."
                          >
                            <IoMdHelpCircle />
                          </span>
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
                              {error}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>
                  <Field<string>
                    name="whatsappUrl"
                    initialValue={data.whatsappUrl ?? undefined}
                    onChangeValidate={z.string().optional()}
                  >
                    {({ value, setValue, isDirty, errors }) => (
                      <div className="mx-auto flex w-52 flex-col">
                        <label
                          className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                        >
                          WhatsApp URL
                          <span
                            className="tooltip"
                            data-tip="Enter the URL of your WhatsApp page. For example: https://www.whatsapp.com/yourbusiness. Leave blank if you do not have a WhatsApp page."
                          >
                            <IoMdHelpCircle />
                          </span>
                        </label>
                        <input
                          className={`input-bordered input ${
                            isDirty ? "input-success" : ""
                          } ${errors.length > 0 ? "input-error" : ""}`}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {errors.length > 0 &&
                          errors.map((error) => (
                            <span key={error} className="text-error text-xs">
                              {error}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>
                </div>
                <div className="col-span-full row-start-2">
                  <button
                    className={`btn btn-success btn-block mt-6 mb-2 ${
                      (errors.length > 0 && "btn-disabled") || ""
                    }`}
                    onClick={submit}
                    type="button"
                  >
                    Save Changes
                  </button>
                  <div>
                    {errors && (
                      <div className="mb-12 text-red-500 text-xs">
                        {errors.map((error) => (
                          <div key={error}>{error}</div>
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
