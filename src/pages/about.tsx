import type { InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { createInnerTRPCContext } from "../server/api/trpc";
import { appRouter } from "../server/api/root";

const TopHero = dynamic(() => import("../components/TopHero"), {
  loading: () => <p>Loading...</p>,
});
const CldImg = dynamic(() => import("../components/CldImg"), {
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
const Markdown = dynamic(() => import("../components/Markdown"), {
  loading: () => <p>Loading...</p>,
});
export const About: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const { business, topHero, services, bottomHero, aboutUs, pageTitle } = props;
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto h-full">
        <Navbar business={business} services={services} />
        <TopHero pageTitle="About Us" hero={topHero} />

        <section className="container mx-auto mt-32 grid w-11/12 place-items-stretch gap-12 lg:grid-cols-2">
          {/* image with inset image */}
          <div className="relative  mr-2 grid h-full grid-cols-12 ">
            {aboutUs && (
              <>
                <div className="col-span-10 col-start-1 row-start-1 h-full ">
                  <CldImg
                    alt="About us"
                    format={aboutUs.primaryImage.format}
                    height={600}
                    width={800}
                    public_Id={aboutUs.primaryImage.public_Id}
                    id={aboutUs.primaryImage.id}
                    blur={aboutUs.primaryImage.blur_url}
                    className="rounded-lg border-4 border-secondary shadow-2xl  md:border-[12px]"
                  />
                </div>
                <div className="col-start-3 col-end-13 row-start-1 pt-20 md:pt-40 lg:pt-48">
                  <CldImg
                    alt="About us"
                    format={aboutUs.secondaryImage.format}
                    height={600}
                    width={800}
                    public_Id={aboutUs.secondaryImage.public_Id}
                    id={aboutUs.secondaryImage.id}
                    blur={aboutUs.secondaryImage.blur_url}
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
            <Markdown className="text-lg" content={aboutUs.markdown} />
            <blockquote className=" rounded-xl bg-base-300  bg-[url(/quote-white.svg)] bg-[right_135%] bg-no-repeat p-4">
              <p className="mb-4 text-lg">{business?.ownerQuote}</p>
              <div className="grid w-1/2">
                <span className="font-medium uppercase text-accent">
                  {business?.ownerName}
                </span>
                <span className={`text-base`}> - {business?.ownerTitle}</span>
              </div>
            </blockquote>
            <button className="btn-primary btn w-fit">More about us</button>
          </div>
        </section>
        <HeroBanner businessName={business.title} hero={bottomHero} />
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

export default About;
