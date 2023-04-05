import type { InferGetStaticPropsType, NextPage } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { type IconList } from "@/IconDisplay";
import LoadingSpinner from "@/LoadingSpinner";
import { prisma } from "~/server/db";
import { env } from "~/env/client.mjs";
import { NextSeo } from "next-seo";

const ServiceSummaryCard = dynamic(import("@/ServiceSummaryCard"), {
  loading: () => <LoadingSpinner />,
});

const DynamicGallery = dynamic(() => import("@/FrontGallery"), {
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

const DynamicTestimonial = dynamic(() => import("@/Testimonial"), {
  loading: () => <LoadingSpinner />,
});

const DynamicFooter = dynamic(() => import("@/Footer"), {
  loading: () => <LoadingSpinner />,
});
const DynamicNavbar = dynamic(() => import("@/Navbar"), {
  loading: () => <LoadingSpinner />,
});
const InlineHTML = dynamic(() => import("@/InlineHTML"), {
  loading: () => <LoadingSpinner />,
});

const HeroBanner = dynamic(() => import("@/BottomHero"), {
  loading: () => <LoadingSpinner />,
});

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const {
    business,
    frontHero,
    aboutUs,
    bottomHero,
    services,
    testimonials,
    mainService,
    service2,
    service3,
    pageTitle,
    gallery,
  } = props;
  return (
    <>
      <NextSeo
        title={pageTitle}
        description={aboutUs.summary}
        noindex={false}
        nofollow={false}
        canonical={env.NEXT_PUBLIC_SITE_URL}
        openGraph={{
          title: business?.title,
          description: aboutUs.summary,
          images: [
            {
              url: `${env.NEXT_PUBLIC_SITE_URL}/.netlify/functions/generator?title=${business.title}&image=${frontHero.primaryImage.public_id}`,
            },
          ],
        }}
      />
      <main className="mx-auto h-full">
        <DynamicNavbar business={business} services={services} />

        {/* Hero Section */}
        <section className="">
          <div
            className="hero relative min-h-[130vh] "
            style={{
              clipPath: "inset(0)",
            }}
          >
            <CldImage
              src={frontHero.primaryImage?.public_id}
              height={900}
              width={1600}
              loading="eager"
              priority={true}
              crop="fill"
              alt="Hero Banner"
              placeholder="blur"
              blurDataURL={frontHero.primaryImage?.blur_url as string}
              className="top-0 left-0 -z-10 aspect-video h-full object-cover lg:fixed"
            />
            <div className="hero-overlay relative z-10 bg-black bg-opacity-60 before:fixed before:left-32 before:top-96 before:hidden before:h-[110vh] before:w-1 before:bg-gradient-to-b before:from-transparent before:via-base-content/20 before:to-transparent after:absolute after:right-32 after:-top-96 after:hidden after:h-[110vh] after:w-1 after:bg-gradient-to-b after:from-transparent after:via-base-content/20 after:to-transparent before:md:block after:md:block"></div>
            <div className="hero-content  z-20 text-center text-white ">
              <div className="relative max-w-md">
                <h1 className="mb-5 -mt-32 font-semibold uppercase text-primary">
                  {business?.title}
                </h1>
                <h2 className="mb-5 font-bold text-3xl md:text-5xl lg:text-7xl">
                  {frontHero?.heading}
                </h2>
                <p className="mb-5 text-xl">{frontHero?.ctaText}</p>
                <Link
                  href="/contact"
                  className="btn-primary btn my-6 rounded-none"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services summary Section */}
        <section className=" mx-auto flex w-10/12 justify-center lg:w-5/6">
          <div className="z-30 -mt-32 grid w-fit justify-center gap-0 rounded-t-md border-t-8 border-primary shadow-lg lg:w-11/12 lg:grid-cols-3">
            <ServiceSummaryCard
              icon={service2.icon as IconList}
              summary={service2.summary}
              title={service2.title}
            />
            <ServiceSummaryCard
              icon={mainService.icon as IconList}
              summary={mainService.summary}
              title={mainService.title}
            />
            <ServiceSummaryCard
              icon={service3.icon as IconList}
              summary={service3.summary}
              title={service3.title}
            />
          </div>
        </section>

        {/* About us summary */}
        <section className="container mx-auto mt-32 grid w-11/12 place-items-stretch gap-12 lg:grid-cols-2">
          {/* image with inset image */}
          <div className="relative  mr-2 grid h-full grid-cols-12 ">
            {aboutUs && (
              <>
                <div className="col-span-10 col-start-1 row-start-1 h-full ">
                  <CldImage
                    alt="About us"
                    format="auto"
                    height={600}
                    width={600}
                    placeholder="blur"
                    sizes={
                      "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    }
                    src={aboutUs.primaryImage?.public_id}
                    blurDataURL={aboutUs.primaryImage?.blur_url}
                    className="rounded-lg border-4 border-secondary shadow-2xl  md:border-[12px]"
                  />
                </div>
                <div className="col-start-3 col-end-13 row-start-1 pt-20 md:pt-40 lg:pt-48">
                  <CldImage
                    alt="About us"
                    format="auto"
                    placeholder="blur"
                    height={600}
                    width={800}
                    sizes={
                      "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    }
                    src={aboutUs.secondaryImage?.public_id}
                    blurDataURL={aboutUs.secondaryImage?.blur_url}
                    className="rounded-lg border-4 border-secondary shadow-2xl md:border-[12px]"
                  />
                </div>
              </>
            )}
          </div>
          {/* text */}
          <div className="prose flex flex-col justify-center prose-a:btn-primary prose-a:btn">
            <span className="font-medium uppercase text-accent">About Us</span>
            <h2 className="mt-0 font-bold text-4xl">About {business?.title}</h2>
            <InlineHTML className="text-lg" content={aboutUs.content} />
            <blockquote className=" rounded-xl bg-base-300  bg-[url(/quote-white.svg)] bg-[right_135%] bg-no-repeat p-4">
              <p className="mb-4 text-lg">{business?.ownerQuote}</p>
              <div className="grid w-1/2">
                <span className="font-medium uppercase text-accent">
                  {business?.ownerName}
                </span>
                <span className={`text-base`}> - {business?.ownerTitle}</span>
              </div>
            </blockquote>
            <Link href="/about" className="btn-primary btn w-fit">
              More about us
            </Link>
          </div>
        </section>

        {/* Middle Hero Section */}
        <section className=" mx-auto mt-32 grid w-11/12 place-items-stretch gap-12 lg:grid-cols-2 ">
          {/* text */}
          <div className="prose order-last flex flex-col justify-center prose-a:btn-primary prose-a:btn lg:order-first ">
            <span className="mt-12 font-medium uppercase text-accent">
              {mainService?.summary}
            </span>
            <h2 className="mt-0 font-bold text-4xl">{mainService?.title}</h2>
            <InlineHTML className="text-lg" content={mainService?.content} />

            <Link href={`/${mainService?.pageName || ""}`} className="w-fit">
              More about {mainService?.title}
            </Link>
          </div>
          {/* image with inset image */}
          <div className="relative grid grid-cols-12   ">
            {mainService && (
              <>
                <div className="col-span-10 col-start-3 row-start-1 ">
                  <CldImage
                    alt={mainService.title}
                    format="auto"
                    height={600}
                    placeholder="blur"
                    width={800}
                    sizes={
                      "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    }
                    src={mainService.primaryImage.public_id}
                    blurDataURL={mainService.primaryImage.blur_url}
                    className=" rounded-lg border-4 border-secondary  shadow-2xl md:border-[12px]"
                  />
                </div>
                <div className="col-start-1 col-end-11 row-start-1 pt-24 md:pt-48">
                  <CldImage
                    alt={mainService.title}
                    format="auto"
                    placeholder="blur"
                    height={600}
                    blurDataURL={mainService.secondaryImage.blur_url}
                    width={800}
                    sizes={
                      "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    }
                    src={mainService.secondaryImage.public_id}
                    className=" rounded-lg border-4 border-secondary shadow-2xl md:border-[12px]"
                  />
                </div>
              </>
            )}
          </div>
        </section>

        {/* short photo gallery */}
        <section className="container mx-auto mb-2 mt-32 flex flex-col items-center text-center">
          <span className="font-medium uppercase text-accent">
            Our Portfolio{" "}
          </span>
          <h2 className="mx-1 mt-2 mb-6 break-words font-bold text-3xl md:text-5xl">
            {mainService?.title}, {service2.title}, and more...
          </h2>

          <DynamicGallery gallery={gallery} />
          <Link href="/gallery" className="btn-primary btn mt-8">
            View full gallery{" "}
          </Link>
        </section>

        {/* Testimonials Section */}
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
          <div className=" mb-6 grid grid-cols-1 justify-evenly gap-12 lg:grid-cols-2 lg:p-12">
            {testimonials?.slice(0, 2).map((testimonial) => (
              <DynamicTestimonial {...testimonial} key={testimonial.name} />
            ))}
          </div>
          <Link href="/testimonials" className="btn-primary btn">
            More reviews
          </Link>
        </section>

        <HeroBanner businessName={business?.title} hero={bottomHero} />
        <DynamicFooter business={business} services={services} />
      </main>
    </>
  );
};

export default Home;

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
  const service2 = serviceData.find(
    (service) => service.position === "SERVICE2"
  ) as (typeof serviceData)[0];
  const service3 = serviceData.find(
    (service) => service.position === "SERVICE3"
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
  const frontHero = heroData.find(
    (hero) => hero.position === "FRONT"
  ) as (typeof heroData)[0];
  const bottomHero = heroData.find(
    (hero) => hero.position === "BOTTOM"
  ) as (typeof heroData)[0];

  const testimonialsData = await prisma.testimonial.findMany({
    where: { highlighted: true },
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
    take: 2,
  });
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
        pageName: service.pageName,
        title: service.title,
      })),

    mainService: {
      ...mainService,
      content: truncateContent(mainService.content || "", 700),
      primaryImage: {
        ...mainService.primaryImage?.image,
        public_id: `${cldFolder}/${
          mainService.primaryImage?.image?.public_id as string
        }`,
      },
      secondaryImage: {
        ...mainService.secondaryImage?.image,
        public_id: `${cldFolder}/${
          mainService.secondaryImage?.image?.public_id as string
        }`,
      },
    },
    service2: {
      title: service2.title,
      summary: service2.summary,
      icon: service2.icon,
    },
    service3: {
      title: service3.title,
      summary: service3.summary,
      icon: service3.icon,
    },
    frontHero: {
      ...frontHero,
      primaryImage: {
        ...frontHero.primaryImage?.image,
        public_id: `${cldFolder}/${
          frontHero.primaryImage?.image?.public_id as string
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
        ? `${cldFolder}/${testimonial.avatarImage.image.public_id}`
        : null,
    })),
    aboutUs: {
      ...aboutUsData,
      content: truncateContent(aboutUsData?.content || "", 700),
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
    gallery: galleryData.imageForGallery.map((image) => ({
      ...image.image,
      public_id: `${cldFolder}/${image.image.public_id}`,
      altText: image.altText,
    })),
    pageTitle:
      businessData.title +
      " | Home" +
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

function truncateContent(content: string, length: number) {
  if (content.length > length) {
    return content.slice(0, length) + "...";
  } else {
    return content;
  }
}
