import Link from "next/link";
import ImageStorageWidget from "./ImageStorageWidget";
import {
  IoMdBusiness,
  IoMdImages,
  IoMdHome,
  IoMdBarcode,
  IoMdHeart,
  IoMdPaper,
  IoMdStarOutline,
} from "react-icons/io";
import {
  MdOutlineCallToAction,
  MdOutlinePanoramaPhotosphere,
} from "react-icons/md";
import { HiOutlineUser, HiOutlineUserGroup } from "react-icons/hi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type Props = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};
export default function Sidebar({ sidebarOpen, toggleSidebar }: Props) {
  const { data } = useSession();
  const { pathname: path } = useRouter();
  const activeStyle = "bg-accent text-accent-content";
  return (
    <div
      className={`${
        sidebarOpen ? "fixed" : "hidden"
      } z-10 h-full w-72 flex-col overflow-hidden bg-base-300 shadow-xl transition-all md:relative md:flex`}
    >
      <ul onClick={toggleSidebar} className="menu">
        <li>
          <Link
            href="/admin"
            className={`${path === "/admin" ? activeStyle : ""}`}
          >
            <IoMdHome />
            Dashboard Home
          </Link>
        </li>
        <li>
          <Link
            href="/admin/images"
            className={`${path === "/admin/images" ? activeStyle : ""}`}
          >
            <IoMdImages />
            Image Management
          </Link>
        </li>
        {data?.user?.admin && (
          <>
            <li>
              <Link
                href="/admin/business"
                className={`${path === "/admin/business" ? activeStyle : ""}`}
              >
                <IoMdBusiness />
                Business Profile
              </Link>
            </li>

            <li>
              <Link
                href="/admin/services"
                className={`${
                  path.startsWith("/admin/services") ? activeStyle : ""
                }`}
              >
                <IoMdBarcode />
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/admin/about"
                className={`${path === "/admin/about" ? activeStyle : ""}`}
              >
                <IoMdHeart />
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/admin/testimonials"
                className={`${
                  path === "/admin/testimonials" ? activeStyle : ""
                }`}
              >
                <IoMdStarOutline />
                Testimonials
              </Link>
            </li>
            <li>
              <Link
                href="/admin/hero"
                className={`${path === "/admin/hero" ? activeStyle : ""}`}
              >
                <MdOutlineCallToAction />
                Hero Banners
              </Link>
            </li>
            <li>
              <Link
                href="/admin/gallery"
                className={`${path === "/admin/gallery" ? activeStyle : ""}`}
              >
                <MdOutlinePanoramaPhotosphere />
                Gallery Editor
              </Link>
            </li>
          </>
        )}
        <li>
          <Link
            href="/admin/blog"
            className={`${path.startsWith("/admin/blog") ? activeStyle : ""}`}
          >
            <IoMdPaper />
            Blog Management
          </Link>
        </li>

        {data?.user?.superAdmin && (
          <li>
            <Link
              href="/admin/user"
              className={`${
                path.startsWith("/admin/user") && path !== "/admin/user/me"
                  ? activeStyle
                  : ""
              }`}
            >
              <HiOutlineUserGroup />
              User Management
            </Link>
          </li>
        )}
        <li>
          <Link
            href="/admin/user/me"
            className={`${path === "/admin/user/me" ? activeStyle : ""}`}
          >
            <HiOutlineUser />
            My Profile
          </Link>
        </li>
        <li></li>
      </ul>
      <div>
        <ImageStorageWidget />
      </div>
    </div>
  );
}
