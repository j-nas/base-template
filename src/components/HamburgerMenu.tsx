import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Link from "next/link";
import router from "next/router";
import dynamic from "next/dynamic";
import { type BusinessInfo } from "@prisma/client";
import { type RouterOutputs } from "../utils/api";

const DynamicSocials = dynamic(() => import("./Socials"), {
  loading: () => <p>Loading...</p>,
});

type Props = {
  services: RouterOutputs["service"]["getActive"];
  business: Omit<BusinessInfo, "createdAt" | "updatedAt">;
};
export default function HamburgerButton({ services, business }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const window = document.querySelector("html");
    if (!window) return;
    if (isOpen) {
      window.style.overflow = "hidden";
    } else {
      window.style.overflow = "auto";
    }
    return () => {
      window.style.overflow = "auto";
    };
  }, [isOpen]);

  function toggleOpen() {
    if (isMounted) {
      setIsMounted(!isMounted);
      setTimeout(() => {
        setIsOpen(!isOpen);
      }, 500);
      return;
    }
    setIsOpen(!isOpen);
    setTimeout(() => {
      setIsMounted(!isMounted);
    }, 10);
  }
  return (
    <>
      <label
        aria-label="nav menu"
        className={`swap-rotate swap disabled pl-4 lg:hidden ${
          isOpen ? "pointer-events-none" : ""
        }`}
      >
        <input type="checkbox" checked={isOpen} onChange={toggleOpen} />

        <svg
          className="swap-off fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 512 512"
        >
          <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
        </svg>

        <svg
          className="swap-on fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 512 512"
        >
          <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
        </svg>
      </label>
      {isOpen &&
        createPortal(
          <div
            className={` 
        fixed top-0 z-[9999] h-screen w-screen `}
          >
            <div
              onClick={toggleOpen}
              className={`absolue h-screen w-screen   ${
                isMounted ? "bg-black bg-opacity-70 backdrop-blur-3xl" : ""
              } transition-all duration-500 ease-in-out `}
            ></div>
            <div
              className={`absolute top-0 flex h-full w-8/12 -translate-x-full flex-col overflow-auto  ${
                isMounted ? "translate-x-[0]" : ""
              } bg-base-300 transition-all duration-500 ease-in-out md:w-1/3`}
            >
              <ul className="menu border-none bg-transparent text-accent-content  ">
                <li className="menu-title  text-center ">
                  <span className="!text-lg">Navigation</span>
                </li>
                <li>
                  <Link
                    href="/"
                    className={`${
                      router.asPath === "/" ? "btn-accent" : "btn-ghost"
                    } btn rounded-none `}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className={`${
                      router.asPath === "/about" ? "btn-accent" : "btn-ghost"
                    } btn rounded-none`}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className={`${
                      router.asPath === "/contact" ? "btn-accent" : "btn-ghost"
                    } btn rounded-none `}
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className={`${
                      router.asPath.startsWith("/services")
                        ? "btn-accent"
                        : "btn-ghost"
                    } btn rounded-none `}
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className={`${
                      router.asPath === "/gallery" ? "btn-accent" : "btn-ghost"
                    } btn rounded-none `}
                  >
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/testimonials"
                    className={`${
                      router.asPath === "/testimonials"
                        ? "btn-accent"
                        : "btn-ghost"
                    } btn rounded-none `}
                  >
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className={`${
                      router.asPath === "/blog" ? "btn-accent" : "btn-ghost"
                    } btn rounded-none`}
                  >
                    Blog
                  </Link>
                </li>
              </ul>
              <div className=" mx-auto my-24 flex place-items-center ">
                <DynamicSocials {...business} />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
