import { useState, useEffect, type ReactElement } from "react";
import { useSession } from "next-auth/react";
import Layout from "@/adminComponents/Layout";
import Breadcrumbs from "@/adminComponents/Breadcrumbs";
import BlogListing from "@/adminComponents/BlogListing";
import LoadingSpinner from "@/LoadingSpinner";
import { api } from "~/utils/api";

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
  { name: "Author (A-Z)", value: "authorAsc" satisfies Sorting },
  { name: "Author (Z-A)", value: "authorDes" satisfies Sorting },
  { name: "Title (A-Z)", value: "titleAsc" satisfies Sorting },
  { name: "Title (Z-A)", value: "titleDes" satisfies Sorting },
  { name: "Last Updated (Old-New)", value: "updatedAsc" satisfies Sorting },
  { name: "Last Updated (New-Old)", value: "updatedDes" satisfies Sorting },
  { name: "Date Published (Old-New)", value: "dateAsc" satisfies Sorting },
  { name: "Date Published (New-Old)", value: "dateDes" satisfies Sorting },
];

export const BlogManager = () => {
  const { status, data: session } = useSession();

  const [sorting, setSorting] = useState<Sorting>("dateAsc");
  const [featuredFilter, setFeaturedFilter] = useState(false);
  const [userFilter, setUserFilter] = useState<string | undefined>(
    session?.user?.id as string
  );

  const { isLoading, data: blogData } = api.blog.getAll.useQuery();

  const userList = [
    ...new Map(
      blogData?.map((obj) => [
        `${obj.author.id}:${obj.author.name}`,
        obj.author,
      ])
    ).values(),
  ];

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.superAdmin) {
        setUserFilter("none");
      }
    }
  }, [status, session]);

  const blogs = blogData
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
      if (featuredFilter === false) return true;
      return blog.featured === featuredFilter;
    })
    .filter((blog) => {
      if (userFilter === "none") return true;
      return blog.author.id === userFilter;
    });

  const sortBlogs = (sortedBlogs: typeof blogs, sort: Sorting) => {
    if (!sortedBlogs) return [];
    switch (sort) {
      case "authorAsc":
        return sortedBlogs.sort((a, b) =>
          a.author.name.localeCompare(b.author.name)
        );
      case "authorDes":
        return sortedBlogs.sort((a, b) =>
          b.author.name.localeCompare(a.author.name)
        );
      case "titleAsc":
        return sortedBlogs.sort((a, b) => a.title.localeCompare(b.title));
      case "titleDes":
        return sortedBlogs.sort((a, b) => b.title.localeCompare(a.title));
      case "dateAsc":
        return sortedBlogs.sort(
          (a, b) => a.createdAt.valueOf() - b.createdAt.valueOf()
        );
      case "dateDes":
        return sortedBlogs.sort(
          (a, b) => b.createdAt.valueOf() - a.createdAt.valueOf()
        );
      case "updatedAsc":
        return sortedBlogs.sort(
          (a, b) => a.updatedAt.valueOf() - b.updatedAt.valueOf()
        );
      case "updatedDes":
        return sortedBlogs.sort(
          (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf()
        );
      default:
        return sortedBlogs;
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col place-items-center overflow-auto">
      <Breadcrumbs subName="Blog Management" subPath="blog" />
      <div>
        <h1 className="my-6 place-self-center text-center font-black  text-2xl">
          Blog Management
        </h1>
        <div className="grid auto-cols-max place-content-center gap-2 ">
          <div className="mx-auto flex w-52 flex-col">
            <label htmlFor="author" className="font-bold tracking-wide text-sm">
              Author
            </label>
            <select
              id="author"
              placeholder="Select an author"
              value={userFilter}
              className="select-bordered select select-sm"
              onChange={(e) => setUserFilter(e.target.value)}
            >
              <option value={"none"}>All</option>
              {userList.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mx-auto flex w-52 flex-col">
            <label
              htmlFor="sorting"
              className="font-bold tracking-wide text-sm"
            >
              Sorting
            </label>
            <select
              className="select-bordered select select-sm "
              id="sorting"
              value={sorting}
              onChange={(e) => setSorting(e.target.value as Sorting)}
            >
              {sorters.map((sorter) => (
                <option key={sorter.value} value={sorter.value}>
                  {sorter.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mx-auto mt-2 flex w-52 ">
            <input
              id="featured"
              type="checkbox"
              className="checkbox"
              checked={featuredFilter}
              onChange={() => setFeaturedFilter(!featuredFilter)}
            />
            <label
              htmlFor="featured"
              className="ml-2 font-bold tracking-wide text-sm"
            >
              Featured posts only
            </label>
          </div>
        </div>

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
        {blogs && <BlogListing blogs={sortBlogs(blogs, sorting)} />}
      </div>
    </div>
  );
};

export default BlogManager;

BlogManager.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
