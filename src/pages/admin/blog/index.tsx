import React, { type ReactElement, useState } from "react";
import Layout from "../../../components/adminComponents/Layout";
import { api } from "../../../utils/api";
import { IoMdConstruct, IoMdHelpCircle } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import Breadcrumbs from "../../../components/adminComponents/Breadcrumbs";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import IconDisplay from "../../../components/IconDisplay";
import Link from "next/link";
import BlogListing from "../../../components/adminComponents/BlogListing";

export const BlogManager = () => {
  const { isLoading, data } = api.blog.getAll.useQuery();
  const [parent, enableAnimations] = useAutoAnimate();
  const ctx = api.useContext();
  const blogs = data?.map((blog) => {
    return {
      id: blog.id,
      title: blog.title,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };
  });

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
        {blogs && <BlogListing blogs={blogs} />}
      </div>
    </div>
  );
};

export default BlogManager;

BlogManager.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
