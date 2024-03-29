import type { InferGetStaticPropsType, NextPage } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import LoadingSpinner from "@/LoadingSpinner";
import { prisma } from "~/server/db";
import { env } from "~/env/client.mjs";
import { NextSeo } from "next-seo";

const TopHero = dynamic(() => import("@/TopHero"), {
  loading: () => <p>Loading...</p>,
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
const FaPhone = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaPhone),
  {
    loading: () => <div>📞</div>,
  }
);
const Footer = dynamic(() => import("@/Footer"), {
  loading: () => <p>Loading...</p>,
});
const HeroBanner = dynamic(() => import("@/BottomHero"), {
  loading: () => <p>Loading...</p>,
});
const Navbar = dynamic(() => import("@/Navbar"), {
  loading: () => <p>Loading...</p>,
});
const InlineHTML = dynamic(() => import("@/InlineHTML"), {
  loading: () => <p>Loading...</p>,
});
export const About: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const { business, topHero, services, bottomHero, aboutUs, pageTitle } = props;
  return (
    <>
      <NextSeo
        title={pageTitle}
        description={aboutUs.summary}
        noindex={false}
        nofollow={false}
        canonical={env.NEXT_PUBLIC_SITE_URL + "/about"}
        openGraph={{
          title: "About Us" + " | " + business?.title,
          description: aboutUs.summary,
          images: [
            {
              url: `${env.NEXT_PUBLIC_SITE_URL}/.netlify/functions/generator?title=About%20Us&image=${aboutUs.primaryImage.public_id}`,
            },
          ],
        }}
      />

      <main className="mx-auto h-full">
        <Navbar business={business} services={services} />
        <TopHero pageTitle="About Us" hero={topHero} />

        <section className="container mx-auto mt-32 grid w-11/12 place-items-stretch gap-12 lg:grid-cols-2">
          {/* image with inset image */}
          <div className="relative  mr-2 grid h-full grid-cols-12 ">
            {aboutUs && (
              <>
                <div className="col-span-10 col-start-1 row-start-1 h-full ">
                  <CldImage
                    alt="About us"
                    height={600}
                    width={800}
                    src={aboutUs.primaryImage.public_id}
                    blurDataURL={aboutUs.primaryImage.blur_url}
                    placeholder="blur"
                    className="rounded-lg border-4 border-secondary shadow-2xl  md:border-[12px]"
                  />
                </div>
                <div className="col-start-3 col-end-13 row-start-1 pt-20 md:pt-40 lg:pt-48">
                  <CldImage
                    alt="About us"
                    height={600}
                    width={800}
                    src={aboutUs.secondaryImage.public_id}
                    blurDataURL={aboutUs.secondaryImage.blur_url}
                    placeholder="blur"
                    className="rounded-lg border-4 border-secondary shadow-2xl md:border-[12px]"
                  />
                </div>
              </>
            )}
          </div>
          {/* text */}
          <div className="prose flex flex-col justify-center">
            <span className="font-medium uppercase text-accent">About Us</span>
            <h2 className="mt-0 font-bold text-4xl">About {business?.title}</h2>
            <InlineHTML
              allowImages
              className="text-lg"
              content={aboutUs.content}
            />
            <blockquote className=" rounded-xl bg-base-300  bg-[url(/quote-white.svg)] bg-[right_135%] bg-no-repeat p-4">
              <p className="mb-4 text-lg">{business?.ownerQuote}</p>
              <div className="grid w-1/2">
                <span className="font-medium uppercase text-accent">
                  {business?.ownerName}
                </span>
                <span className={`text-base`}> - {business?.ownerTitle}</span>
              </div>
            </blockquote>
            <div className="flex">
              <div className="tooltip" data-tip={business.telephone}>
                <Link
                  href={`tel:${business.telephone}`}
                  className="btn-primary btn w-fit no-underline"
                >
                  <FaPhone className="mr-2" />
                  Give us a call
                </Link>
              </div>
            </div>
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
      content: true,
      primaryImage: {
        select: { image: { select: { public_id: true, blur_url: true } } },
      },
      secondaryImage: {
        select: { image: { select: { public_id: true, blur_url: true } } },
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

    aboutUs: {
      ...aboutUsData,
      primaryImage: {
        ...aboutUsData?.primaryImage?.image,
        public_id: `${cldFolder}/${
          aboutUsData?.primaryImage?.image?.public_id as string
        }`,
      },
      secondaryImage: {
        ...aboutUsData?.secondaryImage?.image,
        public_id: `${cldFolder}/${
          aboutUsData?.secondaryImage?.image?.public_id as string
        }`,
      },
    },

    pageTitle:
      businessData.title +
      " | About" +
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
