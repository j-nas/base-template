import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import dynamic from "next/dynamic";
import DarkModeButton from "./DarkModeButton";
// import HamburgerMenu from "./HamburgerMenu";
import { type BusinessInfo } from "@prisma/client";
import { type RouterOutputs } from "../utils/api";

type Props = {
  services: RouterOutputs["service"]["getActive"];
  business: Omit<BusinessInfo, "createdAt" | "updatedAt">;
};

const DynamicHamburgerMenu = dynamic(() => import("./HamburgerMenu"), {
  loading: () => (
    <svg
      className="swap-off fill-current"
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 512 512"
    >
      <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
    </svg>
  ),
});

export default function Navbar({ services, business }: Props) {
  const { theme, setTheme } = useTheme();
  const [scrollPosition, setScrollPosition] = useState(0);
  const router = useRouter();

  useEffect(() => {
    window.addEventListener(
      "scroll",
      () => {
        setScrollPosition(window.scrollY);
      },
      { passive: true }
    );

    return () => {
      window.removeEventListener("scroll", () => {
        setScrollPosition(window.scrollY);
      });
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div
      className={`navbar fixed z-50 w-full ${
        scrollPosition ? "" : "text-white"
      } 
    `}
    >
      <div
        className={` absolute inset-0 -z-10 h-full w-full -translate-y-full bg-base-100 transition-all duration-300 ease-in-out ${
          scrollPosition ? "translate-y-0 shadow-2xl" : ""
        }`}
      ></div>
      <div className="navbar-start">
        <button
          aria-label="home button logo"
          className="btn-ghost btn fill-white stroke-white lowercase text-xl"
        >
          <Logo
            className={`z-50 h-auto w-40 ${
              scrollPosition ? "fill-base-content" : ""
            }`}
          />
        </button>
      </div>

      <div className="navbar-end mr-2 w-full flex-grow">
        <ul className="menu menu-compact menu-horizontal hidden border-none bg-transparent lg:flex  ">
          <li>
            <Link
              href="/"
              className={`${
                router.pathname === "/" ? "btn-accent  btn" : "btn-ghost  btn"
              } rounded-l-lg border-none `}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={`${
                router.pathname === "/about"
                  ? "btn-accent  btn"
                  : "btn-ghost  btn"
              } rounded-none`}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className={`${
                router.pathname === "/contact"
                  ? "btn-accent  btn"
                  : "btn-ghost  btn"
              } rounded-none `}
            >
              Contact
            </Link>
          </li>
          <li tabIndex={0}>
            <Link
              href="/services"
              className={`${
                router.pathname.startsWith("/services")
                  ? "btn-accent  btn"
                  : "btn-ghost  btn"
              } rounded-none `}
            >
              Services
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </Link>
            <ul className="bg-base-300 p-2">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.pageName}`}
                    className={`rounded-none ${
                      router.asPath.includes(service.pageName)
                        ? "btn-accent  btn"
                        : "btn-ghost btn text-base-content"
                    }`}
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <Link
              href="/gallery"
              className={`${
                router.pathname === "/gallery"
                  ? "btn-accent  btn"
                  : "btn-ghost  btn"
              } rounded-none `}
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className={`${
                router.pathname === "/blog"
                  ? "btn-accent  btn"
                  : "btn-ghost  btn"
              } rounded-r-lg`}
            >
              Blog
            </Link>
          </li>
        </ul>
        <DarkModeButton theme={theme} toggleTheme={toggleTheme} />
        <DynamicHamburgerMenu services={services} business={business} />
      </div>
    </div>
  );
}
