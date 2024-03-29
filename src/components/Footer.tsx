import Socials from "./Socials";
import Link from "next/link";
import Logo from "./Logo";
import { type BusinessInfo } from "@prisma/client";

type Props = {
  business: BusinessInfo & {
    aboutUs: string;
  };
  services: {
    title: string;
    pageName: string;
  }[];
};

export default function Footer({ business, services }: Props) {
  return (
    <div className="w-full bg-base-200">
      <footer className="container footer mx-auto bg-base-200 p-10 text-base-content ">
        <nav>
          <span className="footer-title">Company</span>
          <Link href="/">Home</Link>
          <Link href="/about" className="link-hover link">
            About us
          </Link>
          <Link href="/services" className="link-hover link">
            Services
          </Link>
          <Link href="/contact" className="link-hover link">
            Contact
          </Link>

          <Link href="/gallery" className="link-hover link">
            Gallery
          </Link>
          <Link href="/testimonial" className="link-hover link">
            Testimonial
          </Link>
          <Link href="/blog" className="link-hover link">
            Blog
          </Link>
        </nav>
        <nav>
          <span className="footer-title text-base-content">Services</span>
          {services.map((service) => (
            <Link
              key={service.title}
              href={`/services/${service.pageName}`}
              className="link-hover link"
            >
              {service.title}
            </Link>
          ))}
        </nav>
        {/* </div> */}
        <div className="prose">
          <h3>About us</h3>
          <p className="">{business.aboutUs}</p>
        </div>
        <div className="">
          <div className="flex flex-col ">
            <span className="">{business?.address}</span>
            <span>
              {business?.city}
              {", "}
              {business?.province}
            </span>
            <span>{business?.postalCode}</span>
            <span className="">
              <Link className="link" href={`tel:${business.telephone}`}>
                {business.telephone}
              </Link>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="">{business.hours}</span>
            <span className="">{business?.holidays}</span>
          </div>
        </div>
      </footer>

      <footer className="container footer mx-auto border-t border-base-300 bg-base-200 px-10 py-4 text-base-content">
        <div className=" flex grid-flow-col flex-col items-baseline ">
          <Link href="/">
            <Logo className="btn-ghost btn z-50 h-auto w-[160px] fill-base-content" />
          </Link>

          <p className="mx-auto">Copyright © {new Date().getFullYear()}</p>
        </div>
        <div className="pr-4 md:place-self-center md:justify-self-end">
          <Socials {...business} />
        </div>
      </footer>
      <footer className="footer flex w-full justify-center border-t border-base-300 bg-base-200 py-2 px-2  text-center text-base-content ">
        <p className="inline-block w-1/2 text-xs">
          Designed and hosted by{" "}
          <a className="link" href="https://www.shorecel.com">
            Shorecel Web Services
          </a>
        </p>
      </footer>
    </div>
  );
}
