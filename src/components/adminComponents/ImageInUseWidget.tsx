import Link from "next/link";
import type { ImageAdmin } from "../../types/image";

type Props = {
  image: ImageAdmin;
};

export default function ImageInUseWidget({ image }: Props) {
  const { inUseProps: imageUsage } = image;

  return (
    <div className=" mx-2 flex   flex-col place-content-center gap-2 place-self-center  px-4 py-2">
      <div className="flex flex-col gap-2">
        {imageUsage.aboutPrimaryImages.map((about) => (
          <span key={about.id} className="">
            Image in use as{" "}
            <Link className="link" href={`admin/about`}>
              About Us primary image
            </Link>
          </span>
        ))}
        {imageUsage.aboutSecondaryImages.map((about) => (
          <span key={about.id} className="">
            Image in use as{" "}
            <Link className="link" href={`admin/about`}>
              About Us secondary image
            </Link>
          </span>
        ))}
        {imageUsage.testimonialAvatars.map((testimonial) => (
          <span key={testimonial.id} className="">
            Image in use as{" "}
            <Link
              className="link"
              href={`admin/testimonial/${testimonial.id || ""}`}
            >
              {testimonial.name}&apos;s avatar
            </Link>{" "}
            (Testimonial)
          </span>
        ))}
        {imageUsage.userAvatars.map((user) => (
          <span key={user.id} className="">
            Image in use as{" "}
            <Link className="link" href={`admin/user/${user.id || ""}`}>
              {user.name}&apos;s avatar
            </Link>{" "}
            (User)
          </span>
        ))}
        {imageUsage.blogPrimaryImages.map((blog) => (
          <span key={blog.id} className="">
            Image in use as blog post{" "}
            <Link className="link" href={`admin/blog/${blog.id || ""}`}>
              {blog.title}&apos;s primary image
            </Link>
          </span>
        ))}
        {imageUsage.galleryImages.map((gallery) => (
          <span key={gallery.gallery} className="">
            Image in use as a{" "}
            <Link
              className="link"
              href={`admin/gallery/${gallery.gallery?.toLowerCase()}`}
            >
              {gallery.gallery?.toLowerCase()} gallery image
            </Link>
          </span>
        ))}
        {imageUsage.heroPrimaryImages.map((hero) => (
          <span key={hero.id} className="">
            Image in use as the{" "}
            <Link
              className="link"
              href={`admin/hero/${hero.position?.toLowerCase() || ""}`}
            >
              {hero.position?.toLowerCase()} hero banner image
            </Link>
          </span>
        ))}
        {imageUsage.servicePrimaryImages.map((service) => (
          <span key={service.id} className="">
            Image in use as{" "}
            <Link
              className="link"
              href={`admin/service/${service.position?.toLowerCase() || ""}`}
            >
              {service.title}&apos;s primary image
            </Link>{" "}
            (Service)
          </span>
        ))}
        {imageUsage.serviceSecondaryImages.map((service) => (
          <span key={service.id} className="">
            Image in use as{" "}
            <Link
              className="link"
              href={`admin/service/${service.position?.toLowerCase() || ""}`}
            >
              {service.title}&apos;s secondary image
            </Link>{" "}
            (Service)
          </span>
        ))}
      </div>
    </div>
  );
}
