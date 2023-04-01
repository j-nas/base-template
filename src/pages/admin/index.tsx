import Link from "next/link";
import { type ReactElement } from "react";
import Layout from "../../components/adminComponents/Layout";
import { type NextPageWithLayout } from "../_app";
import Breadcrumbs from "../../components/adminComponents/Breadcrumbs";
import { useSession } from "next-auth/react";

export const AdminHome: NextPageWithLayout = () => {
  const { data: session } = useSession();
  return (
    <section className=" relative flex  h-full w-full flex-col place-items-center   pb-12 ">
      <div className="w-full">
        <Breadcrumbs />
      </div>
      <div className="container prose mt-20 h-full place-self-center px-6 pb-12">
        <h1>Dashboard Home</h1>
        <p>
          Welcome the self serve dashboard. Here you can manage site content
          like of your site, including <Link href="admin/images">images</Link>,{" "}
          <Link href="admin/blog">blog posts</Link>, and your{" "}
          <Link href="admin/user/me">user profile.</Link>
        </p>
        <ul>
          <li>
            <Link href="/admin/images">Image Management</Link>
          </li>
          {session?.user?.admin && (
            <>
              <li>
                <Link href="/admin/business">Business Profile</Link>
              </li>
              <li>
                <Link href="/admin/services">Services</Link>
              </li>
              <li>
                <Link href="/admin/about">About Us</Link>
              </li>
              <li>
                <Link href="/admin/testimonials">Testimonial Management</Link>
              </li>
              <li>
                <Link href="/admin/hero">Hero Banners</Link>
              </li>
              <li>
                <Link href="/admin/gallery">Gallery Editor</Link>
              </li>
            </>
          )}
          <li>
            <Link href="/admin/blog">Blogs</Link>
          </li>
          {session?.user?.superAdmin && (
            <li>
              <Link href="/admin/user">User Management</Link>
            </li>
          )}
          <li>
            <Link href="/admin/user/me">My Profile</Link>
          </li>
        </ul>
        <p>
          If you need help or instructions, you can{" "}
          <a href="https://shorecel.com/support">click here</a> to view our
          support page, or email us at{" "}
          <a href="mailto:support@shorecel.com">support@shorecel.com.</a>
          <br />
          We&apos;re always happy to help!
        </p>
      </div>
    </section>
  );
};

export default AdminHome;

AdminHome.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
