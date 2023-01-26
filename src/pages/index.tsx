import type { InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { createInnerTRPCContext } from "../server/api/trpc";
import { appRouter } from "../server/api/root";
import { api } from "../utils/api";
import superjson from "superjson";

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const { theme, setTheme } = useTheme();
  const [scrollPosition, setScrollPosition] = useState(0);

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

  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
  ];

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.currentTarget.value);
  };

  const {} = props;
  const { data: business } = api.businessInfo.getActive.useQuery();
  const { data: topHero } = api.hero.getTop.useQuery();
  const { data: services } = api.service.getActive.useQuery();
  const { data: aboutUs } = api.aboutUs.getCurrent.useQuery();
  // const { data: middleHero } = api.middleHero.getCurrent.useQuery();
  const { data: testimonials } =
    api.testimonial.getFirstTwoHighlighted.useQuery();
  const { data: bottomHero } = api.hero.getBottom.useQuery();
  const mainService = services?.find(
    (service) => service.position === "SERVICE1"
  );

  return (
    <>
      <Head>
        <title>
          {business?.title}
          {" | "}
          {services?.find((service) => service.position === "SERVICE1")?.title}
          {" | "}
          {business?.addressSecondLine}
        </title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main data-theme={theme} className=" h-full ">
        {/* Navbar */}
        <div
          className={`navbar fixed z-50 w-full bg-base-300/50 
          `}
        >
          <div
            className={` absolute inset-0 -z-10 h-full w-full -translate-y-full bg-base-100 transition-all duration-300 ease-in-out ${
              scrollPosition ? "translate-y-0 shadow-2xl" : ""
            }`}
          ></div>
          <div className="navbar-start">
            <button className="btn-ghost btn text-xl lowercase">
              {business?.title}
            </button>
          </div>
          <div className="navbar-center sm:justify-end">
            <select
              className="form-select"
              value={theme}
              onChange={handleThemeChange}
            >
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>
          <div className="navbar-end hidden lg:flex">
            {services
              ?.filter((service?) => service.position)
              .map((service) => (
                <Link href={``} key={service.id}>
                  <button className="btn-ghost btn ">{service.title}</button>
                </Link>
              ))}
          </div>
        </div>

        {/* Hero Section */}
        <section className="">
          <div
            className="clip-path hero relative min-h-[130vh] lg:bg-fixed"
            style={{
              backgroundImage: `url(${topHero ? topHero.image : ""})`,
            }}
          >
            <div className="hero-overlay z-10 bg-opacity-50 bg-gradient-to-b from-base-300/5 via-base-300/50 to-base-100"></div>
            <div className="hero-content z-20 text-center  ">
              <div className="max-w-md">
                <h1 className="mb-5 -mt-32 font-semibold uppercase text-primary">
                  {topHero?.subtitle}
                </h1>
                <h2 className="mb-5 text-5xl font-bold md:text-7xl">
                  {topHero?.title}
                </h2>
                <p className="mb-5 text-xl">{topHero?.description}</p>
                <button className="btn-primary btn rounded-none">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Services summary Section */}
        <section className=" mx-auto flex justify-center lg:w-5/6">
          <div className="z-30 -mt-32 grid w-fit justify-center gap-0 rounded-t-md border-t-8 border-primary shadow-lg lg:w-11/12 lg:grid-cols-3">
            {services?.map((service) => (
              <div className="card rounded-none bg-base-300 " key={service.id}>
                <div className="card-body">
                  <div className="mb-8 h-fit w-fit place-self-center rounded-full bg-primary p-8 text-center">
                    <Image
                      src={service.icon}
                      height={40}
                      width={40}
                      alt={service.title}
                    />
                  </div>
                  <h2 className=" text-center text-xl font-medium">
                    {service.title}
                  </h2>
                  <p className="text-center">{service.shortDescription}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About us summary */}
        <section className=" mx-auto mt-32 grid w-11/12 place-items-center gap-12 lg:grid-cols-2">
          {/* image with inset image */}
          <div className="relative grid grid-cols-12 ">
            {aboutUs && (
              <>
                <div className="col-span-10 col-start-1 row-start-1 ">
                  <Image
                    src={aboutUs?.imageUrl}
                    height={1600}
                    width={2400}
                    className="rounded-xl border-8 border-secondary"
                    alt={aboutUs?.title}
                  />
                </div>
                <div className="col-start-5 col-end-13 row-start-1 pt-20 md:pt-40 lg:pt-48">
                  <Image
                    src={aboutUs?.imageUrl}
                    height={1600}
                    width={2400}
                    className="rounded-xl border-8 border-secondary"
                    alt={aboutUs?.title}
                  />
                </div>
              </>
            )}
          </div>
          {/* text */}
          <div className="prose flex flex-col justify-center">
            <span className="font-medium uppercase text-accent">About Us</span>
            <h2 className="mt-0 text-4xl font-bold">About {business?.title}</h2>
            {aboutUs?.markdown
              .split("\n")
              .slice(0, 2)
              .map((paragraph) => (
                <p key={paragraph} className="mb-4 text-lg">
                  {paragraph}
                </p>
              ))}
            <blockquote className="rounded-xl bg-base-300 bg-[url(/quote-white.svg)] bg-right-bottom bg-no-repeat p-4">
              <p className="mb-4 text-lg">{business?.ownerQuote}</p>
              <span className="font-medium uppercase text-accent">
                {business?.ownerName}
              </span>
              <span className={`text-base`}> - {business?.ownerTitle}</span>
            </blockquote>
            <button className="btn-primary btn w-fit">More about us</button>
          </div>
        </section>

        {/* Middle Hero Section */}
        <section className=" mx-auto mt-32 grid w-11/12 place-items-stretch lg:grid-cols-2">
          {/* text */}
          <div className="prose flex flex-col justify-center ">
            <span className="font-medium uppercase text-accent">
              {mainService?.shortDescription}
            </span>
            <h2 className="mt-0 text-4xl font-bold">{mainService?.title}</h2>
            {mainService?.markdown
              .split("\n")
              .slice(0, 2)
              .map((paragraph) => (
                <p key={paragraph} className="mb-4 text-lg">
                  {paragraph}
                </p>
              ))}

            <button className="btn-primary btn w-fit">
              More about {mainService?.title}
            </button>
          </div>
          {/* image with inset image */}
          <div className="relative grid grid-cols-12 pt-20 md:pt-40 lg:pt-48">
            {mainService && (
              <>
                <div className="col-span-10 col-start-3 row-start-1 ">
                  <Image
                    src={mainService?.imageUrl}
                    height={1600}
                    width={2400}
                    className="rounded-xl border-8 border-secondary"
                    alt={mainService?.title}
                  />
                </div>
                <div className="col-start-1 col-end-9 row-start-1 pt-32">
                  <Image
                    src={mainService.imageUrl}
                    height={1600}
                    width={2400}
                    className="rounded-xl border-8 border-secondary"
                    alt={mainService?.title}
                  />
                </div>
              </>
            )}
          </div>
        </section>

        {/* short photo gallery */}
        <section className="mt-32 flex flex-col items-center text-center">
          <span className="font-medium uppercase text-accent">
            Our Portfolio{" "}
          </span>
          <h2 className="my-2 text-5xl font-bold">
            {
              services?.find((service) => service.position === "SERVICE1")
                ?.title
            }
            ,{" "}
            {
              services?.find((service) => service.position === "SERVICE2")
                ?.title
            }
            , and more...
          </h2>
          <button className="btn-primary btn">View full gallery </button>
        </section>
        {/* Testimonials Section */}
        <section className="mt-32 flex flex-col items-center text-center">
          <span className="font-medium uppercase text-accent">
            Our Reviews{" "}
          </span>
          <h2 className="mt-2 text-5xl font-bold">What our clients say</h2>
          <p className="mt-2 max-w-xl">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Hic qui
            iure illo! Expedita consequuntur obcaecati omnis ipsum quis
            deleniti? Temporibus!
          </p>
          {/* div with 2 cards in a grid */}
          <div className="mt-12 grid grid-cols-1 justify-evenly gap-12 lg:grid-cols-2 lg:p-24">
            {testimonials?.slice(0, 2).map((testimonial) => (
              <div
                key={testimonial.id}
                className=" relative mt-12 rounded-lg bg-base-300 p-6 shadow-2xl"
              >
                <div className="absolute -top-8 left-8 w-20 rounded-full">
                  <Image
                    src={testimonial.avatarUrl}
                    width={300}
                    height={300}
                    alt="Movie"
                    className="rounded-full"
                  />
                </div>
                <div className="grid grid-cols-2 ">
                  <p className="col-span-2 border-b-2 border-secondary pb-4 pt-6">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Aut vero explicabo animi hic non, nemo nisi cum voluptatem
                    dicta quos molestiae. Ipsum, maiores esse? Minus mollitia
                    neque fugit ratione quasi, nam laudantium, deleniti,
                    excepturi cumque iure non consequuntur ea rem?
                  </p>
                  <div className="">
                    <div className="flex flex-col  text-left">
                      <span className="font-medium">{testimonial.name}</span>
                      <span className="text-base">{testimonial.title}</span>
                    </div>
                  </div>
                  <div className="flex justify-end ">
                    <div className="mask mask-star w-6 bg-warning text-base"></div>
                    <div className="mask mask-star w-6 bg-warning text-base"></div>
                    <div className="mask mask-star w-6 bg-warning text-base"></div>
                    <div className="mask mask-star w-6 bg-warning text-base"></div>
                    <div className="mask mask-star w-6 bg-warning text-base"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-primary btn">More reviews</button>
        </section>
        {/* Bottom Hero Section */}
        <section className="mx-0 mt-32 md:mx-14 ">
          <div
            className="hero min-h-[80vh] "
            style={{
              backgroundImage: `url(${topHero ? topHero.image : ""})`,
            }}
          >
            <div className="hero-overlay bg-base-100 bg-opacity-50"></div>
            <div className="hero-content text-center  ">
              <div className="max-w-md">
                <span className="text-medium uppercase text-accent">
                  {bottomHero?.subtitle}
                </span>
                <h2 className="mb-5 text-5xl font-bold md:text-7xl">
                  {bottomHero?.title}
                </h2>
                <p className="mb-5 text-xl">{bottomHero?.description}</p>
                <button className="btn-primary btn rounded-none">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <>
          <footer className="footer bg-base-200 p-10 text-base-content ">
            <nav>
              <span className="footer-title">Company</span>
              <Link href="/" as="/#top">
                Home
              </Link>
              <Link href="/about/" as="/about/#top" className="link-hover link">
                About us
              </Link>
              <Link
                href="/services/"
                as="/services/#top"
                className="link-hover link"
              >
                Services
              </Link>
              <Link
                href="/contact/"
                as="/contact/#top"
                className="link-hover link"
              >
                Contact
              </Link>

              <Link
                href="/gallery/"
                as="/gallery/#top"
                className="link-hover link"
              >
                Gallery
              </Link>
            </nav>
            <div>
              <span className="footer-title text-base-content">
                Useful Links
              </span>
              <Link href="https://www.wcb.ab.ca/" className="link-hover link">
                WCB Alberta
              </Link>
              <Link
                href="https://www.worksafebc.com/"
                className="link-hover link"
              >
                WorkSafeBC
              </Link>
            </div>
            <div className="prose">
              <h3>About us</h3>
              <p className="">{aboutUs?.summary.slice(0, 300)}</p>
            </div>
            <div>
              <h2>
                <i className="fa-solid fa-map-marker-alt before:content-['📍']">
                  Map icon
                </i>
              </h2>
              <div className="flex flex-col pb-2">
                <span>{business?.addressFirstLine}</span>
                <span>{business?.addressSecondLine}</span>
                <span>Postal Code</span>
                <span className="before:content-['📞']">604-123-4567</span>
              </div>
            </div>
          </footer>

          <footer className="footer border-t border-base-300 bg-base-200 px-10 py-4 text-base-content">
            <div className="grid-flow-col items-center ">
              <Image
                src="/logo.svg"
                alt="COMPANY LOGO HERE"
                width={40}
                height={40}
              />
              <p>
                <span className=" text-2xl tracking-wider">
                  {business?.title}
                </span>
                <br />
                Copyright © {new Date().getFullYear()}
              </p>
            </div>
            <div className="pr-4 md:place-self-center md:justify-self-end">
              <div className="grid grid-flow-col gap-4 text-2xl">
                {business?.facebookUrl && (
                  <Link
                    href={business?.facebookUrl}
                    aria-label="facebook page"
                    className="btn-ghost"
                  >
                    <i className="fa-brands fa-facebook">FB</i>
                  </Link>
                )}
                {business?.instagramUrl && (
                  <Link
                    href={business?.instagramUrl}
                    aria-label="instagram page"
                    className="btn-ghost"
                  >
                    <i className="fa-brands fa-instagram"></i>IG
                  </Link>
                )}
                {business?.linkedInUrl && (
                  <Link
                    href={business?.linkedInUrl}
                    aria-label="linkedin profile"
                    className="btn-ghost"
                  >
                    <i className="fa-brands fa-linkedin">LI</i>
                  </Link>
                )}
                <Link
                  scroll={true}
                  href="/contact/"
                  aria-label="contact form"
                  className="btn-ghost"
                >
                  <i className="fa-solid fa-envelope">✉</i>
                </Link>
                {business?.telephone && (
                  <Link
                    scroll={true}
                    href={`phone:${business?.telephone}`}
                    aria-label="contact form"
                    className="btn-ghost"
                  >
                    <i className="fa-solid fa-phone">📞</i>
                  </Link>
                )}
              </div>
            </div>
          </footer>
          <footer className="footer flex w-full justify-center bg-base-200 py-2 px-2  text-center text-base-content ">
            <p className="inline-block w-1/2 text-xs">
              Designed and hosted by{" "}
              <a className="link" href="https://www.shorecel.com">
                Shorecel Web Solutions
              </a>
            </p>
          </footer>
        </>
      </main>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson,
  });

  const business = await ssg.businessInfo.getActive.fetch();
  const services = await ssg.service.getActive.fetch();
  const topHero = await ssg.hero.getTop.fetch();
  const middleHero = await ssg.middleHero.getCurrent.fetch();
  const bottomHero = await ssg.hero.getBottom.fetch();
  const testimonials = await ssg.testimonial.getFirstTwoHighlighted.fetch();
  const aboutUs = await ssg.aboutUs.getCurrent.fetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
      business,
      services,
      topHero,
      middleHero,
      bottomHero,
      testimonials,
      aboutUs,
    },
  };
}
