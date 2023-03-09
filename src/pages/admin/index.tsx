import { NextPage } from "next";
import Link from "next/link";
import { ReactElement } from "react";
import { Layout } from "../../components/AdminComponents";
import { NextPageWithLayout } from "../_app";
import Breadcrumbs from "../../components/adminComponents/Breadcrumbs";

export const AdminHome: NextPageWithLayout = () => {
  return (
    <section className=" relative  flex h-full w-full flex-col   place-items-center ">
      <div className="w-full">
        <Breadcrumbs />
      </div>
      <div className="container prose mt-20 h-full place-self-center px-6">
        <h1>Dashboard Home</h1>
        <p>
          Welcome to your self serve dashboard. Here you can manage the content
          of your site, including <Link href="admin/images">images</Link>,{" "}
          <Link href="admin/blog">blog posts</Link>, and your{" "}
          <Link href="admin/business">business profile.</Link> Choose a section
          from the menu on the left on desktop, or if you're on mobile, then
          press the button at the top to access the menu. to edit. Additionally,
          you can add contributors to the site, and manage your uploaded images.
        </p>
        <p>
          If you need help or instructions, you can{" "}
          <a href="https://shorecel.com/support">click here</a> to view our
          support page, or email us at{" "}
          <a href="mailto:support@shorecel.com">support@shorecel.com.</a>
          <br />
          We're always happy to help!
        </p>
      </div>
    </section>
  );
};

export default AdminHome;

AdminHome.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
