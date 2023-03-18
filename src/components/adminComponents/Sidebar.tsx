import Link from "next/link";
import ImageStorageWidget from "./ImageStorageWidget";
import {
  IoMdBusiness,
  IoMdImages,
  IoMdHome,
  IoMdBarcode,
  IoMdHeart,
  IoMdPaper,
} from "react-icons/io";
import { HiOutlineUserGroup } from "react-icons/hi";

type Props = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

export default function Sidebar({ sidebarOpen, toggleSidebar }: Props) {
  return (
    <div
      className={`${
        sidebarOpen ? "fixed" : "hidden"
      } z-10 h-full w-72 flex-col overflow-hidden bg-base-300 shadow-xl transition-all md:relative md:flex`}
    >
      <ul onClick={toggleSidebar} className="menu">
        <li>
          <Link href="/admin">
            <IoMdHome />
            Dashboard Home
          </Link>
        </li>
        <li>
          <Link href="/admin/business">
            <IoMdBusiness />
            Business Profile
          </Link>
        </li>
        <li>
          <Link href="/admin/images">
            <IoMdImages />
            Image Management
          </Link>
        </li>
        <li>
          <Link href="/admin/services">
            <IoMdBarcode />
            Services Management
          </Link>
        </li>
        <li>
          <Link href="/admin/about">
            <IoMdHeart />
            About Us Management
          </Link>
        </li>
        <li>
          <Link href="/admin/blog">
            <IoMdPaper />
            Blog Management
          </Link>
        </li>

        <li>
          <Link href="/admin/user">
            <HiOutlineUserGroup />
            User Management
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
