import type {
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import dynamic from "next/dynamic";
import { prisma } from "~/server/db";
import { env } from "~/env/client.mjs";
import Link from "next/link";
import LoadingSpinner from "@/LoadingSpinner";
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
const InlineHTML = dynamic(() => import("@/InlineHTML"), {
  loading: () => <LoadingSpinner />,
});
const AvatarDisplay = dynamic(() => import("@/AvatarDisplay"), {
  loading: () => <LoadingSpinner />,
});

export const Blog: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const { business, topHero, services, bottomHero, pageTitle, blog, featured } =
    props;
  return (
    <>
      <NextSeo
        title={pageTitle}
        description={blog.summary}
        noindex={false}
        nofollow={false}
        canonical={env.NEXT_PUBLIC_SITE_URL + "/blog/" + blog.pageName}
        openGraph={{
          title: blog.title + " | " + business?.title,
          description: blog.summary,
          images: [
            {
              url: `${
                env.NEXT_PUBLIC_SITE_URL
              }/.netlify/functions/generator?title=${blog.title.replace(
                / /g,
                "%20"
              )}&subtitle=Blog%20Post&image=${
                bottomHero.primaryImage.public_id
              }`,
            },
          ],
        }}
      />
      <main className="relative mx-auto h-full">
        <Navbar business={business} services={services} />
        <TopHero pageTitle="" hero={topHero} />

        <section className="container mx-4 mt-12 flex flex-wrap place-content-center  sm:mx-12 lg:mx-auto lg:w-5/6  lg:flex-nowrap">
          {/* post*/}
          <div className="mb-12 flex w-full flex-col gap-12 lg:w-full">
            <article
              key={blog.id}
              className="m-0  flex flex-col place-items-end   "
            >
              <figure className="relative h-80 w-full">
                <CldImage
                  src={blog.primaryImage.public_id}
                  placeholder="blur"
                  blurDataURL={blog.primaryImage?.blur_url}
                  fill
                  sizes="50vw"
                  alt={blog.title}
                  className="rounded-lg object-cover"
                />
              </figure>
              <div className="row-span-2 row-start-2 rounded-b-lg  p-8">
                <h3 className="my-8 font-semibold text-3xl">{blog.title}</h3>
                <div className="mb-12 flex items-center border-b-2 border-b-secondary pb-2">
                  <AvatarDisplay
                    name={blog.author.name || ""}
                    public_id={blog.author.avatarImage.public_id || undefined}
                    size={10}
                  />
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
                  <InlineHTML allowImages content={blog.content} />
                </div>
                <div className="">
                  <Link className="btn-primary btn" href={`/blog`}>
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
                    {blog.primaryImage && (
                      <div
                        className={`avatar max-w-fit justify-self-start p-2 `}
                      >
                        <div className="relative h-16 w-16 rounded-full">
                          <CldImage
                            src={blog.primaryImage?.public_id}
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
        <Footer business={business} services={services} />
      </main>
    </>
  );
};

export async function getStaticPaths() {
  const pageNames = await prisma.blog.findMany({
    select: {
      pageName: true,
    },
  });
  return {
    paths: pageNames.map((blog) => ({
      params: {
        slug: blog.pageName,
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
          ? `${cldFolder}/${blog.author?.avatarImage?.image.public_id}`
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
  };

  try {
    const blog = await prisma.blog.findUniqueOrThrow({
      where: { pageName: context.params?.slug },
      include: {
        primaryImage: {
          select: { image: { select: { public_id: true, blur_url: true } } },
        },
        author: {
          select: {
            name: true,
            avatarImage: {
              select: {
                image: { select: { public_id: true, blur_url: true } },
              },
            },
          },
        },
      },
    });

    return {
      props: {
        ...pageData,
        blog: {
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
                ? `${cldFolder}/${blog.author?.avatarImage?.image.public_id}`
                : null,
            },
          },
        },
        pageTitle:
          businessData.title +
          " | " +
          blog.title +
          " | " +
          mainService.title +
          " | " +
          businessData.city +
          " | " +
          businessData.province,
      },
      revalidate: 1,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default Blog;
