import type { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { prisma } from "~/server/db";
import dynamic from "next/dynamic";
import Link from "next/link";
import LoadingSpinner from "@/LoadingSpinner";
import { env } from "~/env/client.mjs";
import { NextSeo } from "next-seo";

const TopHero = dynamic(() => import("@/TopHero"), {
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
const FaPhone = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaPhone),
  {
    loading: () => <div>📞</div>,
  }
);
const Footer = dynamic(() => import("@/Footer"), {
  loading: () => <LoadingSpinner />,
});
const HeroBanner = dynamic(() => import("@/BottomHero"), {
  loading: () => <LoadingSpinner />,
});
const Navbar = dynamic(() => import("@/Navbar"), {
  loading: () => <LoadingSpinner />,
});
const InlineHTML = dynamic(() => import("@/InlineHTML"), {
  loading: () => <LoadingSpinner />,
});

export const ServicePage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { services, pageTitle, bottomHero, business, topHero, serviceContent } =
    props;
  return (
    <>
      <NextSeo
        title={pageTitle}
        description={serviceContent.summary}
        noindex={false}
        nofollow={false}
        canonical={
          env.NEXT_PUBLIC_SITE_URL + "/services/" + serviceContent.pageName
        }
        openGraph={{
          title: serviceContent.title + " | Services | " + business?.title,
          description: `Here are some of the services we are proud to offer in ${business?.city}`,
          images: [
            {
              url: `${
                env.NEXT_PUBLIC_SITE_URL
              }/.netlify/functions/generator?title=${serviceContent.title.replace(
                / /g,
                "%20"
              )}&subtitle=Services&image=${bottomHero.primaryImage.public_id}`,
            },
          ],
        }}
      />
      <main className="mx-auto h-full">
        <Navbar business={business} services={services} />
        <TopHero pageTitle={serviceContent.title} hero={topHero} />

        <section className="container mx-auto mt-32 grid w-11/12 place-items-stretch gap-12 lg:grid-cols-2">
          {/* image with inset image */}
          <div className="relative  mr-2 grid h-full grid-cols-12 ">
            {serviceContent && (
              <>
                <div className="col-span-10 col-start-1 row-start-1 h-full ">
                  <CldImage
                    alt={serviceContent.title}
                    height={600}
                    width={800}
                    src={serviceContent.primaryImage.public_id}
                    blurDataURL={serviceContent.primaryImage.blur_url}
                    placeholder="blur"
                    className="rounded-lg border-4 border-secondary shadow-2xl  md:border-[12px]"
                  />
                </div>
                <div className="col-start-3 col-end-13 row-start-1 pt-20 md:pt-40 lg:pt-48">
                  <CldImage
                    alt={serviceContent.title}
                    height={600}
                    width={800}
                    src={serviceContent.secondaryImage.public_id}
                    blurDataURL={serviceContent.secondaryImage.blur_url}
                    placeholder="blur"
                    className="rounded-lg border-4 border-secondary shadow-2xl md:border-[12px]"
                  />
                </div>
              </>
            )}
          </div>
          {/* text */}
          <div className="prose flex flex-col justify-center">
            <span className="font-medium uppercase text-accent">
              {serviceContent.summary}
            </span>
            <h2 className="mt-0 font-bold text-4xl">
              About {serviceContent.title}
            </h2>
            <InlineHTML
              allowImages
              className="text-lg"
              content={serviceContent.content}
            />

            <div className="flex">
              <div className="tooltip" data-tip={business.telephone}>
                <Link
                  href={`tel:${business.telephone}`}
                  className="btn-primary btn mt-4 w-fit text-primary-content no-underline"
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

export default ServicePage;

export async function getStaticPaths() {
  const pageNames = await prisma.service.findMany({
    select: {
      pageName: true,
    },
  });

  return {
    paths: pageNames.map((pageName) => ({
      params: {
        slug: pageName.pageName,
      },
    })),
    fallback: "blocking",
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>
) {
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

  const serviceContent = serviceData.find(
    (service) => service.pageName === context.params?.slug
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

    serviceContent: {
      ...serviceContent,
      primaryImage: {
        ...serviceContent.primaryImage?.image,
        public_id: `${cldFolder}/${
          serviceContent.primaryImage?.image?.public_id as string
        }`,
      },
      secondaryImage: {
        ...serviceContent.secondaryImage?.image,
        public_id: `${cldFolder}/${
          serviceContent.secondaryImage?.image?.public_id as string
        }`,
      },
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
    bottomHero: {
      ...bottomHero,
      primaryImage: {
        ...bottomHero.primaryImage?.image,
        public_id: `${cldFolder}/${
          bottomHero.primaryImage?.image?.public_id as string
        }`,
      },
    },

    pageTitle:
      businessData.title +
      " | " +
      serviceContent.title +
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
