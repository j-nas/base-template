import type { InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { env } from "~/env/client.mjs";
import { contactFormValidationSchema } from "../utils/validationSchema";
import { api } from "../utils/api";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type z } from "zod";
import { prisma } from "~/server/db";
import LoadingSpinner from "@/LoadingSpinner";

const TopHero = dynamic(() => import("../components/TopHero"), {
  loading: () => <LoadingSpinner />,
});
const InputWrapper = dynamic(() => import("../components/InputWrapper"), {
  loading: () => <LoadingSpinner />,
});
const Link = dynamic(() => import("next/link"), {
  loading: () => <LoadingSpinner />,
});
const CldImage = dynamic(
  () =>
    import("next-cloudinary").then((mod) => {
      return mod.CldImage;
    }),
  {
    loading: () => <LoadingSpinner />,
  }
);
const Footer = dynamic(() => import("../components/Footer"), {
  loading: () => <LoadingSpinner />,
});
const Navbar = dynamic(() => import("../components/Navbar"), {
  loading: () => <LoadingSpinner />,
});

export const Contact: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = (props) => {
  const { business, topHero, services, pageTitle, contactPageHero } = props;
  const [submitted, setSubmitted] = useState(false);
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
                We will get back to you as soon as possible. Please fill out the
                form below.
              </p>
            </div>

            <form
              className="form-control m-4 flex flex-col  rounded-lg px-4 "
              onSubmit={handleSubmit(onSubmit)}
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
              <CldImage
                alt="hero image"
                blurDataURL={contactPageHero.primaryImage.blur_url}
                height={1200}
                src={contactPageHero.primaryImage.public_id}
                width={1200}
                crop="fill"
                className={`z-10  object-none object-top transition-all duration-300 ease-in-out peer-hover:scale-125 hover:scale-125`}
              />
            </div>
          </div>
        </section>

        <Footer business={business} services={services} />
      </main>
    </>
  );
};

export async function getStaticProps() {
  const businessData = await prisma.businessInfo.findFirstOrThrow({
    where: { isActive: true },
  });

  const serviceData = await prisma.service.findMany({
    select: {
      title: true,
      pageName: true,
      position: true,
    },
  });
  const mainService = serviceData.find(
    (service) => service.position === "SERVICE1"
  ) as (typeof serviceData)[0];

  const heroData = await prisma.hero.findMany({
    select: {
      primaryImage: {
        select: { image: { select: { public_id: true, blur_url: true } } },
      },
      ctaText: true,
      heading: true,
      position: true,
    },
  });
  const topHero = heroData.find(
    (hero) => hero.position === "TOP"
  ) as (typeof heroData)[0];
  const contactPageHero = heroData.find(
    (hero) => hero.position === "CONTACT"
  ) as (typeof heroData)[0];

  const aboutUsData = await prisma.aboutUs.findFirst({
    where: { inUse: true },
    select: {
      summary: true,
    },
  });

  const pageData = {
    business: {
      ...businessData,
      aboutUs: aboutUsData?.summary || "",
    },
    services: serviceData
      .sort((a, b) => a.position.localeCompare(b.position))
      .map((service) => ({
        pageName: service.pageName,
        title: service.title,
      })),

    topHero: {
      ...topHero,
      primaryImage: {
        ...topHero.primaryImage?.image,
        public_id: `${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${
          topHero.primaryImage?.image?.public_id as string
        }`,
      },
    },
    contactPageHero: {
      ...contactPageHero,
      primaryImage: {
        ...contactPageHero.primaryImage?.image,
        public_id: `${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${
          contactPageHero.primaryImage?.image?.public_id as string
        }`,
      },
    },

    pageTitle:
      businessData.title +
      " | Contact Us" +
      " | " +
      mainService.title +
      " | " +
      businessData.city +
      " | " +
      businessData.province,
  };
  return {
    props: {
      ...pageData,
    },
    revalidate: 1,
  };
}

export default Contact;
