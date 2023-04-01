import { CldImage } from "next-cloudinary";
import type { RouterOutputs } from "../utils/api";
import Link from "next/link";
import { env } from "../env/client.mjs";

type Props = {
  hero: RouterOutputs["hero"]["getByPosition"];
  businessName: string;
};

export const HeroBanner = ({
  hero: {
    primaryImage: { blur_url, public_id, id },
    heading,
    ctaText,
  },
  businessName,
}: Props) => {
  return (
    <section className={`mx-0 mt-32 md:mx-14`}>
      <div className={`hero`}>
        <CldImage
          src={env.NEXT_PUBLIC_CLOUDINARY_FOLDER + "/" + public_id}
          format="auto"
          alt="hero image"
          placeholder="blur"
          blurDataURL={blur_url}
          height={600}
          width={2000}
          id={id}
          className={`h-[80vh] object-cover`}
        />
        <div className="hero-overlay   z-10 bg-black bg-opacity-60 "></div>
        <div className="hero-content z-20 text-center text-white ">
          <div className="max-w-md">
            <h1 className="mb-5 -mt-32 font-semibold uppercase text-primary">
              {businessName}
            </h1>
            <h2 className="mb-5 font-bold text-5xl md:text-7xl">{heading}</h2>
            <p className="mb-5 text-xl">{ctaText}</p>
            <Link href="/contact" className="btn btn-primary rounded-none">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
