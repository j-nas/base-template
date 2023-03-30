import { useState, type ReactElement } from "react";
import { useSession } from "next-auth/react";
import Layout from "@/adminComponents/Layout";
import Breadcrumbs from "@/adminComponents/Breadcrumbs";
import LoadingSpinner from "@/LoadingSpinner";
import { api } from "~/utils/api";
import TestimonialListing from "@/adminComponents/TestimonialListing";
import { useRouter } from "next/router";

type Sorting =
  | "nameAsc"
  | "nameDes"
  | "companyAsc"
  | "companyDes"
  | "dateAsc"
  | "dateDes";

const sorters = [
  { name: "Name (A-Z)", value: "nameAsc" satisfies Sorting },
  { name: "Name (Z-A)", value: "nameDes" satisfies Sorting },
  { name: "Company (A-Z)", value: "companyAsc" satisfies Sorting },
  { name: "Company (Z-A)", value: "companyDes" satisfies Sorting },
  { name: "Date Published (Old-New)", value: "dateAsc" satisfies Sorting },
  { name: "Date Published (New-Old)", value: "dateDes" satisfies Sorting },
];

export const BlogManager = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sorting, setSorting] = useState<Sorting>("dateAsc");
  const [featuredFilter, setFeaturedFilter] = useState(false);

  const { isLoading, data: testimonials } = api.testimonial.getAll.useQuery();

  const sortTestimonials = (
    sortedBlogs: typeof testimonials,
    sort: Sorting
  ) => {
    if (!sortedBlogs) return [];
    switch (sort) {
      case "nameAsc":
        return sortedBlogs.sort((a, b) => a.name.localeCompare(b.name));
      case "nameDes":
        return sortedBlogs.sort((a, b) => b.name.localeCompare(a.name));
      case "companyAsc":
        return sortedBlogs.sort((a, b) => a.company.localeCompare(b.company));
      case "companyDes":
        return sortedBlogs.sort((a, b) => b.company.localeCompare(a.company));
      case "dateAsc":
        return sortedBlogs.sort(
          (a, b) => a.createdAt.valueOf() - b.createdAt.valueOf()
        );
      case "dateDes":
        return sortedBlogs.sort(
          (a, b) => b.createdAt.valueOf() - a.createdAt.valueOf()
        );

      default:
        return sortedBlogs;
    }
  };

  if (status === "loading" || !session?.user?.admin) {
    return (
      <div className="flex flex-col place-items-center">
        <h1 className="font-bold text-2xl">You are not authorized</h1>
        <button
          className="btn-xl btn-primary btn"
          onClick={() => router.back()}
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col place-items-center overflow-auto">
      <Breadcrumbs subName="Services Manager" subPath="services" />
      <div>
        <h1 className="my-6 place-self-center text-center font-black  text-2xl">
          Testimonial Management
        </h1>
        <div className="grid auto-cols-max place-content-center gap-2 ">
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

        {isLoading && <LoadingSpinner />}
        {testimonials && (
          <TestimonialListing
            testimonials={sortTestimonials(testimonials, sorting).filter(
              (testimonial) =>
                !featuredFilter || testimonial.highlighted === featuredFilter
            )}
          />
        )}
      </div>
    </div>
  );
};

export default BlogManager;

BlogManager.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
