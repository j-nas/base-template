import Link from "next/link";
import { ReactElement } from "react";
import { IoMdConstruct, IoMdTrash } from "react-icons/io";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import AvatarDisplay from "../AvatarDisplay";

type Props = {
  blogs: {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    author?: {
      name: string;
      avatar: string;
      id: string;
    };
  }[];
};

export default function BlogListing({ blogs }: Props) {
  const [parent, enableAnimations] = useAutoAnimate();

  return (
    <div ref={parent} className="mt-4 flex flex-col gap-4 px-4">
      {blogs && (
        <div className="flex flex-col gap-4">
          <h2 className="font-black  text-xl">
            {blogs?.length > 0 ? "Blog Posts" : "No Blog Posts"}
          </h2>

          {blogs?.map((blog) => (
            <div
              key={blog.id}
              className="grid grid-cols-7 rounded-lg bg-base-300 p-4 drop-shadow-2xl"
            >
              <div className=" max-w-20 flex flex-col">
                <AvatarDisplay
                  public_id={blog.author?.avatar}
                  name={blog.author?.name || "Generic Name"}
                  size="10"
                />
              </div>
              <div className="col-span-5 mx-4 flex w-5/6 flex-col flex-wrap place-self-stretch bg-red-600 ">
                <span className="text-md font-medium">
                  <Link href={`/admin/blog/${blog?.id}`}>
                    <span className="link mr-1">{blog.title}</span>
                    {/* <span className="badge badge-primary">
                          <IoMdConstruct className="mr-2 " /> Edit
                        </span> */}
                  </Link>
                </span>
                {blog.createdAt.getUTCMinutes() !==
                  blog.updatedAt.getUTCMinutes() && (
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
              <div className="col-span-6 row-start-2 mt-6 flex gap-2 place-self-center sm:col-auto sm:row-auto sm:mt-0 sm:flex-col ">
                <button className="btn-outline btn-sm btn">
                  <IoMdConstruct className="mr-2" />
                  Edit
                </button>
                <button className="btn-outline btn-error btn-sm btn">
                  <IoMdTrash className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))}
          <div className="rounded-lg bg-base-300 p-4 drop-shadow-2xl">
            <Link href="/blog/new">
              <button className="btn-primary btn-block btn">
                Create New Blog Post
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
