import { useTheme } from "next-themes";

import Link from "next/link";
import Logo from "../Logo";
import DarkModeButton from "../DarkModeButton";
import { useSession, signOut } from "next-auth/react";
import HamburgerButton from "./HamburgerButton";

type Props = {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
};

export default function Navbar({ sidebarOpen, toggleSidebar }: Props) {
  const { theme, setTheme } = useTheme();
  const session = useSession();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="navbar absolute z-20  bg-base-300 shadow-xl">
      <div className="navbar-start  ">
        <HamburgerButton
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />
        <Link
          href="/"
          aria-label="home button logo"
          className="btn btn-ghost hidden md:block "
        >
          <Logo
            className={`z-50 h-auto w-40 fill-base-content stroke-base-content`}
          />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <span className="font-bold  text-lg">Site Dashboard</span>
      </div>

      <div className="mr-2 w-full justify-end md:navbar-end ">
        {session && (
          <>
            <span className="text-xs">
              Logged in as{" "}
              <Link className="link " href="/admin/user/me">
                {session.data?.user?.email}
              </Link>
            </span>
            <button
              onClick={() => signOut()}
              className="btn btn-primary btn-xs ml-2"
            >
              Log out
            </button>
          </>
        )}
        <DarkModeButton theme={theme} toggleTheme={toggleTheme} />
      </div>
    </div>
  );
}
