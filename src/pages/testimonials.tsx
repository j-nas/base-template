import type { InferGetStaticPropsType, NextPage } from "next";
import dynamic from "next/dynamic";
import { prisma } from "~/server/db";
import { env } from "~/env/client.mjs";
import { NextSeo } from "next-seo";
const TopHero = dynamic(() => import("../components/TopHero"), {
  loading: () => <p>Loading...</p>,
});

const Footer = dynamic(() => import("../components/Footer"), {
  loading: () => <p>Loading...</p>,
});
const HeroBanner = dynamic(() => import("../components/BottomHero"), {
  loading: () => <p>Loading...</p>,
});
const Navbar = dynamic(() => import("../components/Navbar"), {
  loading: () => <p>Loading...</p>,
});
const Testimonial = dynamic(() => import("../components/Testimonial"), {
  loading: () => <p>Loading...</p>,
});
export const About: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const { business, testimonials, topHero, services, bottomHero, pageTitle } =
    props;
  return (
    <>
      <NextSeo
        title={pageTitle}
        description="Here is a few reviews from our happy customers. We are proud to have
        a great team and we are always looking to improve our services."
        noindex={false}
        nofollow={false}
        canonical={env.NEXT_PUBLIC_SITE_URL + "/testimonials"}
        openGraph={{
          title: "Testimonials | " + business?.title,
          description:
            "Here is a few reviews from our happy customers. We are proud to have a great team and we are always looking to improve our services.",
          images: [
            {
              url: `${env.NEXT_PUBLIC_SITE_URL}/.netlify/functions/generator?title=Testimonials&image=${bottomHero.primaryImage.public_id}`,
            },
          ],
        }}
      />
      <main className="mx-auto h-full">
        <Navbar business={business} services={services} />
        <TopHero pageTitle="Testimonials" hero={topHero} />

        <section className="mx-2 mt-32 flex flex-col items-center text-center">
          <span className="font-medium uppercase text-accent">
            Our Reviews{" "}
          </span>
          <h2 className="mt-2 font-bold text-5xl">What our clients say</h2>
          <p className="mx-2 mt-2 max-w-xl">
            Here is a few reviews from our happy customers. We are proud to have
            a great team and we are always looking to improve our services.
          </p>
          {/* div with 2 cards in a grid */}
          <div className="mt-12 mb-6 grid grid-cols-1 justify-evenly gap-12 lg:grid-cols-2 lg:p-24 xl:grid-cols-3">
            {testimonials?.map((testimonial) => (
              <Testimonial {...testimonial} key={testimonial.name} />
            ))}
          </div>
        </section>
        <HeroBanner businessName={business.title} hero={bottomHero} />
        <Footer business={business} services={services} />
      </main>
    </>
  );
};

export async function getStaticProps() {
  const cldFolder = env.NEXT_PUBLIC_CLOUDINARY_FOLDER;

  const businessData = await prisma.businessInfo.findFirstOrThrow({
    where: { isActive: true },
  });

  const serviceData = await prisma.service.findMany({
    select: {
      primaryImage: {
        select: { image: { select: { public_id: true, blur_url: true } } },
      },
      secondaryImage: {
        select: { image: { select: { public_id: true, blur_url: true } } },
      },

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
  const bottomHero = heroData.find(
    (hero) => hero.position === "BOTTOM"
  ) as (typeof heroData)[0];

  const testimonialsData = await prisma.testimonial.findMany({
    select: {
      avatarImage: {
        select: { image: { select: { public_id: true, blur_url: true } } },
      },
      name: true,
      company: true,
      quote: true,
      title: true,
      highlighted: true,
    },
  });
  const aboutUsData = await prisma.aboutUs.findFirstOrThrow({
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
        public_id: `${cldFolder}/${
          topHero.primaryImage?.image?.public_id as string
        }`,
      },
    },
    bottomHero: {
      ...bottomHero,
      primaryImage: {
        ...bottomHero.primaryImage?.image,
        public_id: `${cldFolder}/${
          bottomHero.primaryImage?.image?.public_id as string
        }`,
      },
    },
    testimonials: testimonialsData.map((testimonial) => ({
      ...testimonial,
      avatarImage: testimonial.avatarImage
        ? testimonial.avatarImage.image.public_id
        : null,
    })),

    pageTitle:
      businessData.title +
      " | Testimonials" +
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

export default About;
