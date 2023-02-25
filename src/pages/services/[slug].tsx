import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import superjson from "superjson";
import { prisma } from "../../server/db";
import { appRouter } from "../../server/api/root";
import { createInnerTRPCContext } from "../../server/api/trpc";
import { api } from "../../utils/api";
import dynamic from "next/dynamic";
import Head from "next/head";

const TopHero = dynamic(() => import("../../components/TopHero"), {
  loading: () => <p>Loading...</p>,
});
const CldImg = dynamic(() => import("../../components/CldImg"), {
  loading: () => <p>Loading...</p>,
});
const Footer = dynamic(() => import("../../components/Footer"), {
  loading: () => <p>Loading...</p>,
});
const HeroBanner = dynamic(() => import("../../components/BottomHero"), {
  loading: () => <p>Loading...</p>,
});
const Navbar = dynamic(() => import("../../components/Navbar"), {
  loading: () => <p>Loading...</p>,
});
const Markdown = dynamic(() => import("../../components/Markdown"), {
  loading: () => <p>Loading...</p>,
});

export const ServicePage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const {
    service,
    aboutUs,
    pageTitle,
    bottomHero,
    business,
    topHero,
    services,
  } = props;
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto h-full">
        <Navbar business={business} services={services} />
        <TopHero pageTitle={service.title} hero={topHero} />

        <section className="container mx-auto mt-32 grid w-11/12 place-items-stretch gap-12 lg:grid-cols-2">
          {/* image with inset image */}
          <div className="relative  mr-2 grid h-full grid-cols-12 ">
            {service && (
              <>
                <div className="col-span-10 col-start-1 row-start-1 h-full ">
                  <CldImg
                    alt={service.title}
                    format={service.PrimaryImage.format}
                    height={600}
                    width={800}
                    public_Id={service.PrimaryImage.public_Id}
                    id={service.PrimaryImage.id}
                    blur={service.PrimaryImage.blur_url}
                    className="rounded-lg border-4 border-secondary shadow-2xl  md:border-[12px]"
                  />
                </div>
                <div className="col-start-3 col-end-13 row-start-1 pt-20 md:pt-40 lg:pt-48">
                  <CldImg
                    alt="About us"
                    format={service.SecondaryImage.format}
                    height={600}
                    width={800}
                    public_Id={service.SecondaryImage.public_Id}
                    id={service.SecondaryImage.id}
                    blur={service.SecondaryImage.blur_url}
                    className="rounded-lg border-4 border-secondary shadow-2xl md:border-[12px]"
                  />
                </div>
              </>
            )}
          </div>
          {/* text */}
          <div className="prose flex flex-col justify-center">
            <span className="font-medium uppercase text-accent">
              {service.shortDescription}
            </span>
            <h2 className="mt-0 font-bold text-4xl">About {service.title}</h2>
            <Markdown className="text-lg" content={service.markdown} />

            <button className="btn-primary btn w-fit">Contact us today</button>
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

export default ServicePage;

export async function getStaticPaths() {
  const pageNames = await prisma.service.findMany({
    select: {
      pageName: true,
    },
    where: {
      position: {
        not: null,
      },
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
  const ssg = await createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson,
  });

  const slug = context.params?.slug as string;
  const service = await ssg.service.getByPageName.fetch({ pageName: slug });
  const business = await ssg.businessInfo.getActive.fetch();
  const topHero = await ssg.hero.getByPosition.fetch({ position: "TOP" });
  const bottomHero = await ssg.hero.getByPosition.fetch({ position: "BOTTOM" });
  const aboutUs = await ssg.aboutUs.getCurrent.fetch();
  const services = await ssg.service.getActive.fetch();

  const pageTitle = !service
    ? "Our Service"
    : business.title +
      " | " +
      service.title +
      " | " +
      business.city +
      ", " +
      business.province;
  return {
    props: {
      service,
      business,
      topHero,
      pageTitle,
      bottomHero,
      aboutUs,
      services,
    },
  };
}