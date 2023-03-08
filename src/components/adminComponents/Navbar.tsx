import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "../Logo";
import dynamic from "next/dynamic";
import DarkModeButton from "../DarkModeButton";
// import HamburgerMenu from "./HamburgerMenu";
import { type BusinessInfo } from "@prisma/client";
import { type RouterOutputs } from "../../utils/api";
import { useSession } from "next-auth/react";

type Props = {
  services: RouterOutputs["service"]["getActive"];
  business: RouterOutputs["businessInfo"]["getActive"];
  toggleSidebar: () => void;
};

export default function Navbar({ services, business, toggleSidebar }: Props) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const session = useSession();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="navbar absolute z-20  bg-base-300 shadow-xl">
      <div className="navbar-start  md:block">
        <button onClick={toggleSidebar} className="btn-secondary btn md:hidden">
          M
        </button>
        <Link
          href="/"
          aria-label="home button logo"
          className="btn-ghost btn hidden md:block "
        >
          <Logo
            className={`z-50 h-auto w-40 fill-base-content stroke-base-content`}
          />
        </Link>
      </div>
      <div className="navbar-center hidden lg:block">
        <span className="font-bold  text-lg">Admin Dashboard</span>
      </div>

      <div className="mr-2 w-full justify-end md:navbar-end ">
        {session && <button className="btn-primary btn">Log out</button>}
        <DarkModeButton theme={theme} toggleTheme={toggleTheme} />
      </div>
    </div>
  );
}
