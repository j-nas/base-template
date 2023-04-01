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

type Props = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

export default function Sidebar({ sidebarOpen, toggleSidebar }: Props) {
  const { data } = useSession();
  return (
    <div
      className={`${
        sidebarOpen ? "fixed" : "hidden"
      } z-10 h-full w-72 flex-col overflow-hidden bg-base-300 shadow-xl transition-all md:relative md:flex`}
    >
      <ul onClick={toggleSidebar} className="menu">
        <li>
          <Link href="/admin" className="bg-accent text-accent-content">
            <IoMdHome />
            Dashboard Home
          </Link>
        </li>
        <li>
          <Link href="/admin/images">
            <IoMdImages />
            Image Management
          </Link>
        </li>
        {data?.user?.admin && (
          <>
            <li>
              <Link href="/admin/business">
                <IoMdBusiness />
                Business Profile
              </Link>
            </li>

            <li>
              <Link href="/admin/services">
                <IoMdBarcode />
                Services
              </Link>
            </li>
            <li>
              <Link href="/admin/about">
                <IoMdHeart />
                About Us
              </Link>
            </li>
            <li>
              <Link href="/admin/testimonials">
                <IoMdStarOutline />
                Testimonials
              </Link>
            </li>
            <li>
              <Link href="/admin/hero">
                <MdOutlineCallToAction />
                Hero Banners
              </Link>
            </li>
            <li>
              <Link href="/admin/gallery">
                <MdOutlinePanoramaPhotosphere />
                Gallery Editor
              </Link>
            </li>
          </>
        )}
        <li>
          <Link href="/admin/blog">
            <IoMdPaper />
            Blog Management
          </Link>
        </li>

        {data?.user?.superAdmin && (
          <li>
            <Link href="/admin/user">
              <HiOutlineUserGroup />
              User Management
            </Link>
          </li>
        )}
        <li>
          <Link href="/admin/user/me">
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
