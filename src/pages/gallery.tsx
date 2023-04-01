import type { InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { createInnerTRPCContext } from "../server/api/trpc";
import { appRouter } from "../server/api/root";

const TopHero = dynamic(() => import("../components/TopHero"));
const Footer = dynamic(() => import("../components/Footer"));
const Navbar = dynamic(() => import("../components/Navbar"));
const MainGallery = dynamic(() => import("../components/MainGallery"));

export const Gallery: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = (props) => {
  const { business, topHero, services, aboutUs, pageTitle, gallery } = props;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`${business.title}. Here is some of our work.`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto h-full">
        <Navbar business={business} services={services} />
        <TopHero pageTitle="Our gallery" hero={topHero} />
        <section className="mx-auto max-w-[1960px]  p-4">
          <MainGallery gallery={gallery} />
        </section>

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
  const gallery = await ssg.gallery.getMainGallery.fetch();
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
      gallery,
    },
  };
}

export default Gallery;
