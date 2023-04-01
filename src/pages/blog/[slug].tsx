import type {
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import superjson from "superjson";
import { prisma } from "../../server/db";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { createInnerTRPCContext } from "../../server/api/trpc";
import { appRouter } from "../../server/api/root";
import { env } from "../../env/client.mjs";
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
const Markdown = dynamic(() => import("../../components/Markdown"), {
  loading: () => <p>Loading...</p>,
});

export const Blog: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const {
    business,
    topHero,
    services,
    bottomHero,
    aboutUs,
    pageTitle,
    blog,
    featured,
  } = props;
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative mx-auto h-full">
        <Navbar business={business} services={services} />
        <TopHero pageTitle="" hero={topHero} />

        <section className="mx-4 mt-12 flex flex-wrap place-content-center  sm:mx-12 lg:mx-auto lg:w-5/6  lg:flex-nowrap">
          {/* post*/}
          <div className="mb-12 flex w-full flex-col gap-12 lg:w-full">
            <article key={blog.id} className="m-0  flex flex-col   ">
              <figure className="relative h-80 w-full">
                <CldImage
                  src={
                    env.NEXT_PUBLIC_CLOUDINARY_FOLDER +
                    "/" +
                    (blog.image?.public_id || "")
                  }
                  placeholder="blur"
                  blurDataURL={blog.image?.blur_url}
                  fill
                  alt={blog.title}
                  className="rounded-lg object-cover"
                />
              </figure>
              <div className="row-span-2 row-start-2 rounded-b-lg  p-8">
                <h3 className="my-8 font-semibold text-3xl">{blog.title}</h3>
                <div className="mb-12 flex items-center border-b-2 border-b-secondary pb-2">
                  {blog.author.image ? (
                    <div className={`avatar max-w-fit justify-self-start p-2 `}>
                      <div className="relative w-10 rounded-full">
                        <CldImage
                          src={
                            env.NEXT_PUBLIC_CLOUDINARY_FOLDER +
                            "/" +
                            blog.author.image?.public_id
                          }
                          fill
                          alt={blog.title}
                          className="rounded-t-lg"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="placeholder avatar max-w-fit justify-self-start p-2 ">
                      <div className="relative w-10 rounded-full bg-neutral-focus text-neutral-content">
                        {blog.author?.name.split(" ").map((n) => n[0] ?? "")}
                      </div>
                    </div>
                  )}
                  <span className="ml-4"> {blog.author?.name}</span>
                  <div className="mx-4 h-[3px] w-[3px] bg-accent"></div>
                  <span className="">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="prose mb-8">
                  <Markdown content={blog.markdown} />
                </div>
                <div className="">
                  <Link className="btn btn-primary" href={`/blog`}>
                    Back to blogs
                  </Link>
                </div>
              </div>
            </article>
          </div>
          {/* featured posts */}
          <div className="sticky top-24 mb-12 h-fit w-full rounded-lg border-2  border-accent bg-base-200 pb-1 shadow-lg shadow-accent lg:ml-12 lg:w-1/2">
            <div className="relative mb-8 flex w-full place-content-center">
              <h2 className=" mb-2 p-0.5 text-center text-lg after:absolute after:inset-x-0 after:bottom-0 after:mx-auto  after:h-1 after:w-1/2 after:bg-secondary">
                Featured Posts
              </h2>
            </div>
            {featured.length > 0 ? (
              featured.map((blog, index) => (
                <div
                  key={blog.id}
                  className={`p-6 ${
                    index % 2 === 0 ? "bg-base-300" : "bg-base-200"
                  }`}
                >
                  <Link href={`/blog/${blog.pageName}`} className="flex">
                    {blog.image && (
                      <div
                        className={`avatar max-w-fit justify-self-start p-2 `}
                      >
                        <div className="relative h-16 w-16 rounded-full">
                          <CldImage
                            src={
                              env.NEXT_PUBLIC_CLOUDINARY_FOLDER +
                              "/" +
                              blog.image?.public_id
                            }
                            fill
                            alt={blog.title}
                            className="rounded-full"
                          />
                        </div>
                      </div>
                    )}
                    <div className="ml-8 w-full place-self-center justify-self-start">
                      <h3 className="text-md font-semibold">{blog.title}</h3>
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className=" flex  place-content-center pb-4">
                <p>Nothing featured yet</p>
              </div>
            )}
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

export async function getStaticPaths() {
  const pageNames = await prisma.blog.findMany({
    select: {
      title: true,
    },
  });
  console.log(pageNames, "pageNames");
  return {
    paths: pageNames.map((blog) => ({
      params: {
        slug: blog.title.replace(/\s/g, "-").toLowerCase(),
      },
    })),
    fallback: "blocking",
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>
) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    transformer: superjson,
    ctx: createInnerTRPCContext({ session: null }),
  });
  const slug = context.params?.slug as string;
  console.log(slug);
  const business = await ssg.businessInfo.getActive.fetch();
  const services = await ssg.service.getActive.fetch();
  const topHero = await ssg.hero.getByPosition.fetch({ position: "TOP" });
  const bottomHero = await ssg.hero.getByPosition.fetch({ position: "BOTTOM" });
  const aboutUs = await ssg.aboutUs.getCurrent.fetch();
  const featured = await ssg.blog.getSummaries
    .fetch()
    .then((data) => data.filter((blog) => blog.featured));
  const blog = await ssg.blog.getByPageName.fetch({ pageName: slug });
  const mainService =
    services.find((service) => service.position === "SERVICE1") ?? null;
  const pageTitle = !mainService
    ? "Blog Post"
    : blog.title + " | " + business.title;

  return {
    props: {
      business,
      services,
      bottomHero,
      topHero,
      aboutUs,
      pageTitle,
      featured,
      blog,
    },
  };
}

export default Blog;
