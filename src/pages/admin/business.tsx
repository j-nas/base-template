import { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import { Layout } from "../../components/AdminComponents";
import { api } from "../../utils/api";
import { UseFormProps, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import InputWrapper from "../../components/InputWrapper";

export const BusinessProfile: NextPageWithLayout = () => {
  return (
    <div className="grid h-full w-full grid-rows-[max-content_1fr]  place-items-center overflow-auto">
      <div className="">
        <h1 className="p-8 text-4xl">Business Profile</h1>
      </div>
      <div className="p-4"></div>
    </div>
  );
};

export default BusinessProfile;

BusinessProfile.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
