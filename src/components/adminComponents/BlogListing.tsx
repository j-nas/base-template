import Link from "next/link";
import { IoMdConstruct, IoMdTrash } from "react-icons/io";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import AvatarDisplay from "../AvatarDisplay";
import { api } from "../../utils/api";
import toast, { Toaster } from "react-hot-toast";
import BlogDeleteDialog from "./dialogs/BlogDeleteDialog";
import { useSession } from "next-auth/react";

type Props = {
  blogs: {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    author?: {
      name: string;
      avatar?: string;
      id: string;
    };
    featured?: boolean;
  }[];
  user?: {
    name: string;
    avatar?: string;
    id: string;
  };
};

export default function BlogListing({ blogs, user }: Props) {
  const { data: session, status } = useSession();
  const [parent] = useAutoAnimate();
  const ctx = api.useContext();
  const deleteMutation = api.blog.delete.useMutation();
  const featuredMutation = api.blog.toggleFeatured.useMutation();
  const handleBlogDelete = async (id: string) => {
    await toast.promise(
      deleteMutation.mutateAsync(
        { id },
        {
          onSuccess: async () => {
            await ctx.blog.invalidate();
            await ctx.blog.getAll.refetch();
          },
          onError: (error) => {
            console.log(error);
            toast.error(error.message);
          },
        }
      ),
      {
        loading: "Deleteing...",
        success: "Blog Deleted!",
        error: "Error",
      }
    );
  };

  const handleBlogFeaturedToggle = async (id: string) => {
    await toast.promise(
      featuredMutation.mutateAsync(
        { id },
        {
          onSuccess: async () => {
            await ctx.blog.invalidate();
            await ctx.blog.getAll.refetch();
          },
          onError: (error) => {
            console.log(error);
            toast.error(error.message);
          },
        }
      ),
      {
        loading: "Updating...",
        success: "Blog Updated!",
        error: "Error",
      }
    );
  };

  return (
    <div className="mt-4 flex flex-col gap-4 px-4">
      <Toaster position="bottom-right" />
      {blogs && (
        <div ref={parent} className="flex flex-col gap-4">
          <h2 className="font-black  text-xl">
            {blogs?.length > 0 ? "Blog Posts" : "No Blog Posts"}
          </h2>

          {blogs?.map((blog) => (
            <div
              key={blog.id}
              className="grid rounded-lg bg-base-300 p-4 drop-shadow-2xl sm:grid-cols-7"
            >
              <Link
                href={`/admin/user/${blog.author?.id || user?.id || "me"}`}
                className="flex scale-125 flex-col place-self-center"
              >
                <AvatarDisplay
                  public_id={blog.author?.avatar || user?.avatar}
                  name={blog.author?.name || user?.name || "User"}
                  size="10"
                />
              </Link>
              <div className="col-span-5 mx-4 flex w-5/6 flex-col flex-wrap place-self-end  sm:place-self-stretch ">
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
                <Link
                  href={`/admin/user/${blog.author?.id || user?.id || "me"}`}
                  className="link place-self-start text-right  italic text-xs"
                >
                  {blog.author?.name || user?.name || "User"}
                </Link>
              </div>
              <div className="col-span-6 row-start-2 mt-6 grid w-full gap-2 place-self-center sm:col-auto sm:row-auto sm:mt-0 sm:w-auto sm:flex-col  ">
                {status === "authenticated" && session.user?.admin && (
                  <button
                    className=""
                    onClick={async (e) => {
                      e.preventDefault();
                      await handleBlogFeaturedToggle(blog.id);
                    }}
                  >
                    <div className="btn-outline btn-sm btn h-fit w-full  sm:w-fit">
                      <input
                        type="checkbox"
                        id={blog.id}
                        className="checkbox checkbox-sm m-1"
                        checked={blog.featured}
                        readOnly
                      ></input>
                      <span className="ml-2 text-xs">Featured</span>
                    </div>
                  </button>
                )}
                <Link
                  href={`/admin/blog/${blog.id}`}
                  className="btn-outline btn-sm btn"
                >
                  <IoMdConstruct className="mr-2" />
                  Edit
                </Link>
                <BlogDeleteDialog
                  blog={blog}
                  handleBlogDelete={handleBlogDelete}
                >
                  <div className="btn-outline btn-error btn-sm btn w-full">
                    <IoMdTrash className="mr-2" />
                    Delete
                  </div>
                </BlogDeleteDialog>
              </div>
            </div>
          ))}
          <div className="rounded-lg bg-base-300 p-4 drop-shadow-2xl">
            <Link href="/admin/blog/new">
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
