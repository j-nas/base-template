import type { InferGetStaticPropsType, NextPage } from "next";
import dynamic from "next/dynamic";
import { prisma } from "~/server/db";
import { env } from "~/env/client.mjs";
import { NextSeo } from "next-seo";

const TopHero = dynamic(() => import("../components/TopHero"));
const Footer = dynamic(() => import("../components/Footer"));
const Navbar = dynamic(() => import("../components/Navbar"));
const MainGallery = dynamic(() => import("../components/MainGallery"));

export const Gallery: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = (props) => {
  const { business, topHero, services, pageTitle, gallery } = props;

  return (
    <>
      <NextSeo
        title={pageTitle}
        description="Check out some of our work"
        noindex={false}
        nofollow={false}
        canonical={env.NEXT_PUBLIC_SITE_URL + "/gallery"}
        openGraph={{
          title: "Gallery" + " | " + business?.title,
          description: "Check out some of our work",
          images: [
            {
              url: `${env.NEXT_PUBLIC_SITE_URL}/.netlify/functions/generator?title=Gallery&image=${topHero.primaryImage.public_id}`,
            },
          ],
        }}
      />
      <main className="mx-auto h-full">
        <Navbar business={business} services={services} />
        <TopHero pageTitle="Our gallery" hero={topHero} />
        <section className="mx-auto max-w-[1960px]  p-4">
          <MainGallery gallery={gallery} />
        </section>

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

  const aboutUsData = await prisma.aboutUs.findFirst({
    where: { inUse: true },
    select: {
      summary: true,
      content: true,
      primaryImage: {
        select: { image: { select: { public_id: true, blur_url: true } } },
      },
      secondaryImage: {
        select: { image: { select: { public_id: true, blur_url: true } } },
      },
    },
  });
  const galleryData = await prisma.gallery.findFirstOrThrow({
    where: { position: "MAIN" },
    include: {
      imageForGallery: {
        select: {
          image: {
            select: {
              public_id: true,
              blur_url: true,
              height: true,
              width: true,
            },
          },
          altText: true,
          index: true,
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
        pageName: service.pageName,
        title: service.title,
      })),

    mainService: {
      ...mainService,
    },

    topHero: {
      ...topHero,
      primaryImage: {
        ...topHero.primaryImage?.image,
        public_id: `${cldFolder}/${
          topHero.primaryImage?.image?.public_id as string
        }`,
      },
    },

    gallery: galleryData.imageForGallery
      .sort((a, b) => (a.index || 0) - (b.index || 0))
      .map((image) => ({
        ...image.image,
        public_id: `${cldFolder}/${image.image.public_id}`,
        altText: image.altText,
        index: image.index || 0,
        height: image.image.height,
        width: image.image.width,
      })),
    pageTitle:
      businessData.title +
      " | Gallery" +
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

export default Gallery;
