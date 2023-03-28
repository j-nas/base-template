import { useState, useEffect, type ReactElement } from "react";
import Layout from "../../../components/adminComponents/Layout";
import { api } from "../../../utils/api";
import Breadcrumbs from "../../../components/adminComponents/Breadcrumbs";
import LoadingSpinner from "../../../components/LoadingSpinner";
import BlogListing from "../../../components/adminComponents/BlogListing";
import { useSession } from "next-auth/react";

type Sorting =
  | "authorAsc"
  | "authorDes"
  | "titleAsc"
  | "titleDes"
  | "updatedAsc"
  | "updatedDes"
  | "dateAsc"
  | "dateDes";

const sorters = [
  { name: "Name (A-Z)", value: "authorAsc" satisfies Sorting },
  { name: "Name (Z-A)", value: "authorDes" satisfies Sorting },
  { name: "title (A-Z)", value: "titleAsc" satisfies Sorting },
  { name: "title (Z-A)", value: "titleDes" satisfies Sorting },
  { name: "Last Updated (Old-New)", value: "updatedAsc" satisfies Sorting },
  { name: "Last Updated (New-Old)", value: "updatedDes" satisfies Sorting },
  { name: "Date Published (Old-New)", value: "dateAsc" satisfies Sorting },
  { name: "Date Published (New-Old)", value: "dateDes" satisfies Sorting },
];

export const BlogManager = () => {
  const { status, data: session } = useSession();

  const [sorting, setSorting] = useState<Sorting>("dateAsc");
  const [featuredFilter, setFeaturedFilter] = useState<boolean | null>(null);
  const [userFilter, setUserFilter] = useState<string | null>(
    session?.user?.id as string
  );

  const { isLoading, data } = api.blog.getAll.useQuery();

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.superAdmin) {
        setUserFilter(null);
      }
    }
  }, [status, session]);

  const blogs = data
    ?.map((blog) => {
      return {
        id: blog.id,
        title: blog.title,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        featured: blog.featured,
        author: {
          name: blog.author?.name,
          avatar: blog.author?.image,
          id: blog.author?.id,
        },
      };
    })
    .filter((blog) => {
      if (featuredFilter === null) return true;
      return blog.featured === featuredFilter;
    })
    .filter((blog) => {
      if (userFilter === null) return true;
      return blog.author.id === userFilter;
    });

  // const sortBlogs = (
  //   images: RouterOutputs["image"]["getAllImages"],
  //   sort: Sorting
  // ) => {
  //   switch (sort) {
  //     case "nameAsc" satisfies Sorting:
  //       return images.sort((a: any, b: any) =>
  //         a.public_id.localeCompare(b.public_id)
  //       );
  //     case "nameDes":
  //       return images.sort((a: any, b: any) =>
  //         b.public_id.localeCompare(a.public_id)
  //       );
  //     case "sizeAsc":
  //       return images.sort((a: any, b: any) => a.bytes - b.bytes);
  //     case "sizeDes":
  //       return images.sort((a: any, b: any) => b.bytes - a.bytes);
  //     case "dateAsc" satisfies Sorting:
  //       return images.sort((a: any, b: any) => a.createdAt - b.createdAt);
  //     case "dateDes" satisfies Sorting:
  //       return images.sort((a: any, b: any) => b.createdAt - a.createdAt);
  //     default:
  //       return images;
  //   }
  // };

  return (
    <div className="relative flex h-full w-full flex-col place-items-center overflow-auto">
      <Breadcrumbs subName="Services Manager" subPath="services" />
      <div>
        <h1 className="my-6 place-self-center text-center font-black  text-2xl">
          Blog Management
        </h1>
        <span>current filter: {userFilter}</span>
        {/* {!isLoading && (
          <div className="form-control ml-8 mt-6 place-self-center lg:place-self-start">
            <div className="input-group">
              <span className="text-md font-bold uppercase">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="select-bordered select"
              >
                {sorters.map((sorter) => (
                  <option key={sorter.value} value={sorter.value}>
                    {sorter.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )} */}
        {isLoading && <LoadingSpinner />}
        {blogs && <BlogListing blogs={blogs} />}
      </div>
    </div>
  );
};

export default BlogManager;

BlogManager.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
