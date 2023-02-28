import type { InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { createInnerTRPCContext } from "../../server/api/trpc";
import { appRouter } from "../../server/api/root";
import Link from "next/link";
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
        <TopHero pageTitle="Our Services" hero={topHero} />

        <section className="container mx-auto mt-32 grid w-11/12 place-items-stretch gap-12 ">
          {services.map((service) => (
            <div
              key={service.id}
              className="card bg-base-300 shadow-2xl md:card-side"
            >
              <figure className="w-full md:max-w-xs">
                <CldImage
                  alt={service.shortDescription}
                  format={service.primaryImage.format}
                  src={`${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${service.primaryImage.public_Id}`}
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
                <p>{service.shortDescription}</p>
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

export default Services;
