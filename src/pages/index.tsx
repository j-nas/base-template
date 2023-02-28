import type { InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import Image from "next/image";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { createInnerTRPCContext } from "../server/api/trpc";
import { appRouter } from "../server/api/root";
import { cloudinaryUrlGenerator } from "../utils/cloudinaryApi";
import Link from "next/link";

const DynamicGallery = dynamic(() => import("../components/FrontGallery"), {
  loading: () => <p>Loading...</p>,
});

const CldImg = dynamic(() => import("../components/CldImg"), {
  loading: () => <p>Loading...</p>,
});

const DynamicTestimonial = dynamic(() => import("../components/Testimonial"), {
  loading: () => <p>Loading...</p>,
});

const DynamicFooter = dynamic(() => import("../components/Footer"), {
  loading: () => <p>Loading...</p>,
});
const DynamicNavbar = dynamic(() => import("../components/Navbar"), {
  loading: () => null,
});
const InlineMarkdown = dynamic(() => import("../components/InlineMarkdown"), {
  loading: () => <p>Loading...</p>,
});

const HeroBanner = dynamic(() => import("../components/BottomHero"), {
  loading: () => <p>Loading...</p>,
});

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const {
    business,
    frontHero,
    frontHeroImageUrl,
    aboutUs,
    bottomHero,
    services,
    testimonials,
    mainService,
    pageTitle,
    gallery,
  } = props;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto h-full">
        <DynamicNavbar business={business} services={services} />

        {/* Hero Section */}
        <section className="">
          <div
            className="hero relative min-h-[130vh]  lg:bg-fixed"
            style={{
              backgroundImage: `url(${frontHeroImageUrl})`,
            }}
          >
            <div className="hero-overlay relative z-10 bg-black bg-opacity-60 "></div>
            <div className="hero-content z-20 text-center text-white ">
              <div className="max-w-md">
                <h1 className="mb-5 -mt-32 font-semibold uppercase text-primary">
                  {business?.title}
                </h1>
                <h2 className="mb-5 font-bold text-5xl md:text-7xl">
                  {frontHero?.heading}
                </h2>
                <p className="mb-5 text-xl">{frontHero?.ctaText}</p>
                <Link href="/contact" className="btn-primary btn rounded-none">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services summary Section */}
        <section className=" mx-auto flex w-10/12 justify-center lg:w-5/6">
          <div className="z-30 -mt-32 grid w-fit justify-center gap-0 rounded-t-md border-t-8 border-primary shadow-lg lg:w-11/12 lg:grid-cols-3">
            {services.slice(0, 3).map((service) => (
              <div className="card rounded-none bg-base-300 " key={service.id}>
                <div className="card-body">
                  <div className="mb-8 h-auto w-fit place-self-center rounded-full bg-primary py-4 px-4 text-center">
                    <Image
                      src="https://icons.getbootstrap.com/assets/icons/1-circle.svg"
                      width={24}
                      height={24}
                      alt="icon"
                    />
                  </div>
                  <h2 className=" text-center font-medium text-xl">
                    {service.title}
                  </h2>
                  <p className="text-center">{service.shortDescription}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About us summary */}
        <section className="container mx-auto mt-32 grid w-11/12 place-items-stretch gap-12 lg:grid-cols-2">
          {/* image with inset image */}
          <div className="relative  mr-2 grid h-full grid-cols-12 ">
            {aboutUs && (
              <>
                <div className="col-span-10 col-start-1 row-start-1 h-full ">
                  <CldImg
                    alt="About us"
                    format={aboutUs.PrimaryImage.format}
                    height={600}
                    width={800}
                    public_Id={aboutUs.PrimaryImage.public_Id}
                    id={aboutUs.PrimaryImage.id}
                    blur={aboutUs.PrimaryImage.blur_url}
                    className="rounded-lg border-4 border-secondary shadow-2xl  md:border-[12px]"
                  />
                </div>
                <div className="col-start-3 col-end-13 row-start-1 pt-20 md:pt-40 lg:pt-48">
                  <CldImg
                    alt="About us"
                    format={aboutUs.SecondaryImage.format}
                    height={600}
                    width={800}
                    public_Id={aboutUs.SecondaryImage.public_Id}
                    id={aboutUs.SecondaryImage.id}
                    blur={aboutUs.SecondaryImage.blur_url}
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
            <InlineMarkdown className="text-lg" content={aboutUs.markdown} />
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
              {mainService?.shortDescription}
            </span>
            <h2 className="mt-0 font-bold text-4xl">{mainService?.title}</h2>
            <InlineMarkdown
              className="text-lg"
              content={mainService?.markdown}
            />

            <Link href={`/${mainService?.pageName}`} className="w-fit">
              More about {mainService?.title}
            </Link>
          </div>
          {/* image with inset image */}
          <div className="relative grid grid-cols-12   ">
            {mainService && (
              <>
                <div className="col-span-10 col-start-3 row-start-1 ">
                  <CldImg
                    alt={mainService.title}
                    format={mainService.PrimaryImage.format}
                    height={600}
                    width={800}
                    public_Id={mainService.PrimaryImage.public_Id}
                    id={mainService.PrimaryImage.id}
                    blur={mainService.PrimaryImage.blur_url}
                    className=" rounded-lg border-4 border-secondary  shadow-2xl md:border-[12px]"
                  />
                </div>
                <div className="col-start-1 col-end-11 row-start-1 pt-24 md:pt-48">
                  <CldImg
                    alt={mainService.title}
                    format={mainService.SecondaryImage.format}
                    height={600}
                    blur={mainService.SecondaryImage.blur_url}
                    width={800}
                    public_Id={mainService.SecondaryImage.public_Id}
                    id={mainService.SecondaryImage.id}
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
            {
              services?.find((service) => service.position === "SERVICE1")
                ?.title
            }
            , , and more...
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
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Hic qui
            iure illo! Expedita consequuntur obcaecati omnis ipsum quis
            deleniti? Temporibus!
          </p>
          {/* div with 2 cards in a grid */}
          <div className="mt-12 mb-6 grid grid-cols-1 justify-evenly gap-12 lg:grid-cols-2 lg:p-24">
            {testimonials?.slice(0, 2).map((testimonial) => (
              <DynamicTestimonial {...testimonial} key={testimonial.id} />
            ))}
          </div>
          <Link href="/testimonials" className="btn-primary btn">
            More reviews
          </Link>
        </section>

        <HeroBanner businessName={business?.title} hero={bottomHero} />
        <DynamicFooter
          aboutSummary={aboutUs.summary}
          business={business}
          services={services}
        />
      </main>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
  });

  const business = await ssg.businessInfo.getActive.fetch();
  const services = await ssg.service.getActive.fetch();
  const frontHero = await ssg.hero.getByPosition.fetch({ position: "FRONT" });
  const bottomHero = await ssg.hero.getByPosition.fetch({ position: "BOTTOM" });
  const testimonials = await ssg.testimonial.getFirstTwoHighlighted.fetch();
  const aboutUs = await ssg.aboutUs.getCurrent.fetch();
  aboutUs.markdown = truncateMarkdown(aboutUs.markdown, 700);
  const gallery = await ssg.gallery.getFrontPageGallery.fetch();

  const frontHeroImageUrl = cloudinaryUrlGenerator(
    frontHero.PrimaryImage.public_Id,
    frontHero.PrimaryImage.format
  );

  const mainService =
    services.find((service) => service.position === "SERVICE1") ?? null;
  if (mainService)
    mainService.markdown = truncateMarkdown(mainService.markdown, 700);
  const pageTitle = !mainService
    ? "Home"
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
      frontHero,
      bottomHero,
      testimonials,
      aboutUs,
      frontHeroImageUrl,
      mainService,
      pageTitle,
      gallery,
    },
  };
}

function truncateMarkdown(markdown: string, length: number) {
  if (markdown.length > length) {
    return markdown.slice(0, length) + "...";
  } else {
    return markdown;
  }
}
