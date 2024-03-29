import type { InferGetStaticPropsType, NextPage } from "next";
import dynamic from "next/dynamic";
import { env } from "~/env/client.mjs";
import { prisma } from "~/server/db";
import LoadingSpinner from "@/LoadingSpinner";
import Link from "next/link";
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
const Footer = dynamic(() => import("@/Footer"));
const HeroBanner = dynamic(() => import("@/BottomHero"), {
  loading: () => <LoadingSpinner />,
});
const Navbar = dynamic(() => import("@/Navbar"), {
  loading: () => <LoadingSpinner />,
});
const AvatarDisplay = dynamic(() => import("@/AvatarDisplay"), {
  loading: () => <LoadingSpinner />,
});

export const Blog: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const {
    business,
    topHero,
    services,
    bottomHero,
    pageTitle,
    blogs,
    featured,
  } = props;
  return (
    <>
      <NextSeo
        title={pageTitle}
        description={`Check out our latest blog posts`}
        noindex={false}
        nofollow={false}
        canonical={env.NEXT_PUBLIC_SITE_URL + "/blog"}
        openGraph={{
          title: "Blog | " + business?.title,
          description: `Check out our latest blog posts`,
          images: [
            {
              url: `${env.NEXT_PUBLIC_SITE_URL}/.netlify/functions/generator?title=Blog&image=${bottomHero.primaryImage.public_id}`,
            },
          ],
        }}
      />
      <main className="relative mx-auto h-full">
        <Navbar business={business} services={services} />
        <TopHero pageTitle="Blog" hero={topHero} />

        <section className="mx-4 mt-12 flex flex-wrap place-content-center  sm:mx-12 lg:mx-auto lg:w-4/6  lg:flex-nowrap">
          {/* post list */}
          <div className="mb-12 flex w-full flex-col gap-12 lg:w-5/6">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="m-0 mt-0 flex flex-col rounded-lg bg-base-300 shadow-lg shadow-accent "
              >
                <figure className="relative h-80 w-full">
                  <CldImage
                    src={blog.primaryImage.public_id}
                    placeholder="blur"
                    blurDataURL={blog.primaryImage?.blur_url}
                    fill
                    alt={blog.title}
                    className="rounded-t-lg object-cover"
                  />
                </figure>
                <div className="row-span-2 row-start-2 rounded-b-lg border-2 border-accent p-8">
                  <div className="flex items-center border-b-2 border-b-secondary">
                    <AvatarDisplay
                      size={10}
                      name={blog.author.name || ""}
                      public_id={blog.author.avatarImage.public_id || undefined}
                    />
                  </div>
                  <div className="mb-8">
                    <h3 className="my-8 font-semibold text-3xl">
                      {blog.title}
                    </h3>
                    <p>{blog.summary}</p>
                  </div>
                  <div className="">
                    <Link
                      className="btn btn-primary"
                      href={`/blog/${blog.pageName}`}
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            ))}
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
                    {blog.primaryImage && (
                      <div
                        className={`avatar max-w-fit justify-self-start p-2 `}
                      >
                        <div className="relative h-16 w-16 rounded-full">
                          <CldImage
                            src={blog.primaryImage?.public_id}
                            fill
                            alt={blog.title}
                            className="rounded-lg"
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
      pageName: true,
      position: true,
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
    },
  });
  const blogData = await prisma.blog.findMany({
    include: {
      author: {
        select: {
          name: true,
          avatarImage: {
            select: { image: { select: { public_id: true, blur_url: true } } },
          },
        },
      },
      primaryImage: {
        select: { image: { select: { public_id: true, blur_url: true } } },
      },
    },
  });

  const blogs = blogData.map((blog) => ({
    ...blog,
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
    primaryImage: {
      ...blog.primaryImage?.image,
      public_id: `${cldFolder}/${
        blog.primaryImage?.image?.public_id as string
      }`,
    },
    author: {
      name: blog.author?.name,
      avatarImage: {
        ...blog.author?.avatarImage?.image,
        public_id: blog.author?.avatarImage?.image.public_id
          ? blog.author?.avatarImage?.image.public_id
          : null,
      },
    },
  }));
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
    blogs: blogs,
    featured: blogs.filter((blog) => blog.featured),

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

export default Blog;
