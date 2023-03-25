import Link from "next/link";
import { ReactElement } from "react";
import { IoMdConstruct, IoMdTrash } from "react-icons/io";

type Props = {
  blogs: {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export default function BlogListing({ blogs }: Props) {
  return (
    <div className="mt-4 flex flex-col gap-4 px-4">
      {blogs && (
        <div className="flex flex-col gap-4">
          <h2 className="font-black  text-xl">
            {blogs?.length > 0 ? "Blog Posts" : "No Blog Posts"}
          </h2>

          {blogs?.map((blog) => (
            <div
              key={blog.id}
              className="grid grid-cols-6 rounded-lg bg-base-300 p-4 drop-shadow-2xl"
            >
              <div className="col-span-5 mx-4 flex w-5/6  flex-col flex-wrap place-self-center ">
                <span className="text-md font-medium">
                  <Link href={`/admin/blog/${blog?.id}`}>
                    <span className="link mr-1">{blog.title}</span>
                    {/* <span className="badge badge-primary">
                          <IoMdConstruct className="mr-2 " /> Edit
                        </span> */}
                  </Link>
                </span>
                {blog.createdAt !== blog.updatedAt && (
                  <span className="text-xs">
                    Last updated:{" "}
                    {new Intl.DateTimeFormat(undefined, {
                      dateStyle: "long",
                      timeStyle: "short",
                    }).format(blog.updatedAt)}
                  </span>
                )}
                <span className="text-xs">
                  Created:{" "}
                  {new Intl.DateTimeFormat(undefined, {
                    dateStyle: "long",
                    timeStyle: "short",
                  }).format(blog.createdAt)}
                </span>
              </div>
              <div className="col-span-6 row-start-2 flex gap-2 place-self-center sm:col-auto sm:row-auto sm:flex-col ">
                <button className="btn-outline btn btn-sm">
                  <IoMdConstruct className="mr-2" />
                  Edit
                </button>
                <button className="btn-outline btn btn-sm">
                  <IoMdTrash className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))}
          <div className="rounded-lg bg-base-300 p-4 drop-shadow-2xl">
            <Link href="/services/new">
              <button className="btn btn-primary btn-block">
                Create New Blog Post
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
