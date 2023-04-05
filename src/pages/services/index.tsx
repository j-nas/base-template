import type { InferGetStaticPropsType, NextPage } from "next";
import dynamic from "next/dynamic";
import { prisma } from "~/server/db";
import Link from "next/link";
import { env } from "~/env/client.mjs";
import { NextSeo } from "next-seo";
const TopHero = dynamic(() => import("../../components/TopHero"), {
  loading: () => <p>Loading...</p>,
});
const CldImage = dynamic(() =>
  import("next-cloudinary").then((mod) => mod.CldImage)
);
const Footer = dynamic(() => import("../../components/Footer"));
const HeroBanner = dynamic(() => import("../../components/BottomHero"), {
  loading: () => <p>Loading...</p>,
});
const Navbar = dynamic(() => import("../../components/Navbar"), {
  loading: () => <p>Loading...</p>,
});

export const Services: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = (props) => {
  const { business, topHero, services, bottomHero, pageTitle } = props;
  return (
    <>
      <NextSeo
        title={pageTitle}
        description={`Here are some of the services we are proud to offer in ${business?.city}`}
        noindex={false}
        nofollow={false}
        canonical={env.NEXT_PUBLIC_SITE_URL + "/services"}
        openGraph={{
          title: "Services | " + business?.title,
          description: `Here are some of the services we are proud to offer in ${business?.city}`,
          images: [
            {
              url: `${env.NEXT_PUBLIC_SITE_URL}/.netlify/functions/generator?title=Services&image=${bottomHero.primaryImage.public_id}`,
            },
          ],
        }}
      />
      <main className="mx-auto h-full">
        <Navbar business={business} services={services} />
        <TopHero pageTitle="Our Services" hero={topHero} />

        <section className="container mx-auto mt-32 grid w-11/12 place-items-stretch gap-12 ">
          {services.map((service) => (
            <div
              key={service.pageName}
              className="card bg-base-300 shadow-2xl md:card-side"
            >
              <figure className="w-full md:max-w-xs">
                <CldImage
                  alt={service.summary}
                  src={service.primaryImage.public_id}
                  height="1600"
                  width="1600"
                  placeholder="blur"
                  blurDataURL={service.primaryImage.blur_url}
                  gravity="auto"
                  crop="thumb"
                  className=" h-full object-cover transition-transform hover:scale-110"
                  sizes="100vw, 1280px"
                />
              </figure>
              <div className="card-body ">
                <h2 className="card-title">{service.title}</h2>
                <p>{service.summary}</p>
                <div className="card-actions justify-end">
                  <Link
                    href={`/services/${service.pageName}`}
                    className="btn-primary btn"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          ))}
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

      title: true,
      summary: true,
      content: true,
      pageName: true,
      position: true,
      icon: true,
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

  const aboutUsData = await prisma.aboutUs.findFirst({
    where: { inUse: true },
    select: {
      summary: true,
    },
  });
  const galleryData = await prisma.gallery.findFirstOrThrow({
    where: { position: "FRONT" },
    include: {
      imageForGallery: {
        select: {
          image: { select: { public_id: true, blur_url: true } },
          altText: true,
        },
      },
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
        ...service,
        primaryImage: {
          blur_url: service.primaryImage?.image?.blur_url as string,
          public_id: `${cldFolder}/${
            service.primaryImage?.image?.public_id as string
          }`,
        },
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

    gallery: galleryData.imageForGallery.map((image) => ({
      ...image.image,
      public_id: `${cldFolder}/${image.image.public_id}`,
      altText: image.altText,
    })),
    pageTitle:
      businessData.title +
      " | Services" +
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

export default Services;
