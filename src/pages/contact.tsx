import type { InferGetStaticPropsType, NextPage } from "next";
import dynamic from "next/dynamic";
import { env } from "~/env/client.mjs";
import { useState } from "react";
import { z } from "zod";
import { prisma } from "~/server/db";
import LoadingSpinner from "@/LoadingSpinner";
import { Form, Field } from "houseform";
import { toast, Toaster } from "react-hot-toast";
import { NextSeo } from "next-seo";

const TopHero = dynamic(() => import("../components/TopHero"), {
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

type FormData = {
  name: string;
  email: string;
  message: string;
};

export const Contact: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = (props) => {
  const { business, topHero, services, pageTitle, contactPageHero } = props;
  const [submitted, setSubmitted] = useState(false);

  const messageSubmitHandler = (formData: FormData) => {
    console.log(formData);
    toast.success("Message sent!");
  };

  return (
    <>
      <NextSeo
        title={pageTitle}
        description={`Let's get in touch. Click here for our email contact form, or give us a call at ${business.telephone}.`}
        noindex={false}
        nofollow={false}
        canonical={env.NEXT_PUBLIC_SITE_URL + "/contact"}
        openGraph={{
          url: env.NEXT_PUBLIC_SITE_URL + "/contact",
          title: "Contact Us | " + business?.title,
          description: `Let's get in touch. Click here for our email contact form, or give us a call at ${business.telephone}.`,
          images: [
            {
              url: `${env.NEXT_PUBLIC_SITE_URL}/.netlify/functions/generator?title=Contact%20Us&image=${contactPageHero.primaryImage.public_id}`,
            },
          ],
        }}
      />
      <main className="mx-auto h-full">
        <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
        <Navbar business={business} services={services} />
        <TopHero pageTitle="Contact Us" hero={topHero} />

        <section className="my-12 flex flex-wrap bg-base-100">
          <div className="mx-auto max-w-max place-self-center ">
            <div className="m-12">
              <span className="font-medium uppercase text-accent">Contact</span>
              <h2 className="mb-8 mt-2 font-bold text-5xl">Get in touch</h2>
              <p>
                We will get back to you as soon as possible. Please fill out the
                form below.
              </p>
            </div>
            <Form<FormData> onSubmit={(values) => messageSubmitHandler(values)}>
              {({ submit, errors }) => (
                <>
                  <form className="form-control m-4 flex flex-col  rounded-lg px-4 ">
                    <div className="input-group-lg my-4 flex flex-wrap  justify-items-stretch gap-4">
                      <Field<string>
                        name="name"
                        onChangeValidate={z
                          .string()
                          .min(1, { message: "Please enter a name" })
                          .max(100, { message: "Name is too long" })}
                      >
                        {({ isDirty, onBlur, value, errors, setValue }) => (
                          <div className="mx-auto flex w-full flex-col md:w-2/5">
                            <label
                              className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                            >
                              Name
                            </label>
                            <input
                              className={`input-bordered input w-full ${
                                isDirty ? "input-success" : ""
                              } ${errors.length > 0 ? "input-error" : ""}`}
                              type="text"
                              id="email"
                              disabled={submitted}
                              onChange={(e) => setValue(e.target.value)}
                              value={value}
                              onBlur={onBlur}
                            />
                          </div>
                        )}
                      </Field>
                      <Field<string>
                        name="email"
                        onChangeValidate={z
                          .string()
                          .email("Please enter a valid email address")}
                      >
                        {({ isDirty, onBlur, value, errors, setValue }) => (
                          <div className="mx-auto flex w-full flex-col md:w-2/5">
                            <label
                              className={`font-bold tracking-wide text-sm 
                                ${errors.length > 0 ? "!text-error" : ""}
                                
                                ${isDirty ? "text-success" : ""}`}
                            >
                              Email
                            </label>
                            <input
                              className={`input-bordered input w-full ${
                                isDirty ? "input-success" : ""
                              } ${errors.length > 0 ? "input-error" : ""}`}
                              type="text"
                              disabled={submitted}
                              value={value}
                              onBlur={onBlur}
                              onChange={(e) => setValue(e.target.value)}
                            />
                          </div>
                        )}
                      </Field>
                    </div>
                    <Field<string>
                      name="message"
                      onChangeValidate={z
                        .string()
                        .min(5, { message: "Message is too short" })
                        .max(1000, {
                          message:
                            "Please keep the message under 1000 characters",
                        })}
                    >
                      {({ isDirty, value, onBlur, errors, setValue }) => (
                        <div className="mx-6 flex w-full flex-col place-self-center md:w-11/12">
                          <label
                            className={`font-bold tracking-wide text-sm 
                              ${errors.length > 0 ? "!text-error" : ""}
                              
                              ${isDirty ? "text-success" : ""}`}
                          >
                            Message
                          </label>
                          <textarea
                            id="message"
                            className={`textarea-bordered textarea mb-2 h-32  w-full ${
                              isDirty ? "input-success" : ""
                            } ${errors.length > 0 ? "input-error" : ""}`}
                            value={value}
                            disabled={submitted}
                            onBlur={onBlur}
                            onChange={(e) => setValue(e.target.value)}
                            maxLength={1000}
                          />
                          <span className="mb-6">
                            {1000 - value.length} characters remaining
                          </span>
                        </div>
                      )}
                    </Field>
                    {!submitted ? (
                      <button
                        type="submit"
                        className="btn-primary btn-block btn place-self-center md:w-11/12"
                        onClick={(e) => {
                          e.preventDefault();
                          setSubmitted(true);
                          void submit();
                        }}
                      >
                        Submit
                      </button>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="text-success">Message sent!</span>
                      </div>
                    )}
                    <div className="m-4 flex flex-col">
                      {errors.map((error) => (
                        <span key={error} className="text-error">
                          {error}
                        </span>
                      ))}
                    </div>
                  </form>
                </>
              )}
            </Form>
          </div>
          <div className="mx-auto">
            <div className="lg-auto relative mx-8 mt-8 h-max  max-w-xl place-self-stretch overflow-hidden rounded-lg">
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
