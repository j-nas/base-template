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
};

export default function Navbar({ services, business }: Props) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const session = useSession();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="navbar absolute  bg-base-300 shadow-xl">
      <div className="navbar-start">
        <Link href="/" aria-label="home button logo" className="btn-ghost btn ">
          <Logo
            className={`z-50 h-auto w-40 fill-base-content stroke-base-content`}
          />
        </Link>
      </div>
      <div className="navbar-center hidden lg:block">
        <span className="font-bold uppercase text-lg">Page Administration</span>
      </div>

      <div className="navbar-end mr-2  ">
        {session && <button className="btn-primary btn">Log out</button>}
        <DarkModeButton theme={theme} toggleTheme={toggleTheme} />
      </div>
    </div>
  );
}
