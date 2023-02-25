import type { InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { createInnerTRPCContext } from "../server/api/trpc";
import { appRouter } from "../server/api/root";

import { contactFormValidationSchema } from "../utils/validationSchema";
import { api } from "../utils/api";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";

const TopHero = dynamic(() => import("../components/TopHero"));
const InputWrapper = dynamic(() => import("../components/InputWrapper"));
const Link = dynamic(() => import("next/link"));
const CldImg = dynamic(() =>
  import("next-cloudinary").then((mod) => mod.CldImage)
);
const Footer = dynamic(() => import("../components/Footer"));
const Navbar = dynamic(() => import("../components/Navbar"));

export const Contact: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = (props) => {
  const { business, topHero, services, bottomHero, aboutUs, pageTitle } = props;
  const { blur_url, format, height, width, public_Id, id } =
    bottomHero.PrimaryImage;
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const mutation = api.contactForm.sendContactForm.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: () => {
      alert("Error sending message");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof contactFormValidationSchema>>({
    resolver: zodResolver(contactFormValidationSchema),
  });

  const onSubmit: SubmitHandler<
    z.infer<typeof contactFormValidationSchema>
  > = async (data) => {
    await mutation.mutateAsync(data);
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`${business.title} Contact Form. Get in touch with us today!`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto h-full">
        <Navbar business={business} services={services} />
        <TopHero pageTitle="Contact Us" hero={topHero} />

        <section className="my-12 mx-8 flex flex-wrap bg-base-100">
          <div className="mx-auto max-w-max place-self-center ">
            <div className="m-12">
              <span className="font-medium uppercase text-accent">Contact</span>
              <h2 className="mb-8 mt-2 font-bold text-5xl">Get in touch</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam
              </p>
            </div>

            <form
              className="form-control m-4 flex flex-col  rounded-lg px-4 "
              onSubmit={handleSubmit(onSubmit)}
              data-netlify="true"
            >
              <div className="input-group-lg my-4 flex flex-wrap  justify-between gap-4">
                <InputWrapper
                  htmlFor="email"
                  error={errors.email?.message}
                  label="Email"
                  className=""
                >
                  <input
                    className="input-bordered input w-full"
                    type="text"
                    id="email"
                    {...register("email")}
                  />
                </InputWrapper>
                <InputWrapper
                  htmlFor="phone"
                  label="Phone"
                  error={errors.phone?.message}
                >
                  <input
                    className="input-bordered input w-full"
                    type="text"
                    {...register("phone")}
                  />
                </InputWrapper>
              </div>
              <InputWrapper
                htmlFor="message"
                label="Message"
                error={errors.message?.message}
              >
                <textarea
                  id="message"
                  className="textarea-bordered textarea mb-12 h-24  w-full"
                  {...register("message")}
                />
              </InputWrapper>

              {!submitted && (
                <button type="submit" className="btn-primary btn-block btn">
                  Submit
                </button>
              )}
            </form>
          </div>
          <div className="mx-auto">
            <div className="lg-auto relative mx-auto mt-8 h-max  max-w-xl place-self-stretch overflow-hidden rounded-lg">
              <div className="peer absolute top-0 left-0 z-20 h-full w-full bg-base-300/60"></div>
              <div className="peer absolute bottom-0 left-0 z-30 ml-4 mb-4 flex h-fit  flex-col  ">
                <span className="font-bold">Email</span>
                <Link
                  className="group self-start"
                  href={`mailto:${business.email}`}
                >
                  {business.email}
                  <span className="block h-0.5 max-w-0 bg-base-content transition-all duration-500 group-hover:max-w-full"></span>
                </Link>
                <span className="font-bold">Phone</span>
                <Link
                  className="group self-start"
                  href={`tel:${business.telephone}`}
                >
                  {business.telephone}
                  <span className=" block h-0.5 max-w-0 bg-base-content transition-all duration-500 group-hover:max-w-full"></span>
                </Link>
                <span className="font-bold">Address</span>
                <span> {business.address}</span>
                <span> {business.city + ", " + business.province}</span>
                <span> {business.postalCode}</span>
              </div>
              <CldImg
                alt="hero image"
                blurDataURL={blur_url}
                format={format}
                height={1200}
                src={`${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${public_Id}`}
                width={1200}
                crop="fill"
                id={id}
                className={`z-10  object-none object-top transition-all duration-300 ease-in-out peer-hover:scale-125 hover:scale-125`}
              />
            </div>
          </div>
        </section>

        <Footer
          aboutSummary={aboutUs.summary}
          business={business}
          services={services}
        />
      </main>
    </>
  );
};

export async function getStaticProps() {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
  });

  const business = await ssg.businessInfo.getActive.fetch();
  const services = await ssg.service.getActive.fetch();
  const topHero = await ssg.hero.getByPosition.fetch({ position: "TOP" });
  const bottomHero = await ssg.hero.getByPosition.fetch({ position: "BOTTOM" });
  const aboutUs = await ssg.aboutUs.getCurrent.fetch();
  console.log(business);
  const mainService =
    services.find((service) => service.position === "SERVICE1") ?? null;
  const pageTitle = !mainService
    ? "About Us"
    : business.title +
      " | " +
      mainService.title +
      " | " +
      business.city +
      ", " +
      business.province;

  return {
    props: {
      business,
      services,
      bottomHero,
      topHero,
      aboutUs,
      pageTitle,
    },
  };
}

export default Contact;
