import { CldImage } from "next-cloudinary";

type Props = {
  hero: {
    primaryImage: {
      blur_url?: string;
      public_id: string;
    };
  };
  pageTitle: string;
};

export default function TopHero({ hero: { primaryImage }, pageTitle }: Props) {
  return (
    <section className="">
      <div className=" hero relative min-h-[40vh]  ">
        {primaryImage && (
          <CldImage
            alt={pageTitle}
            placeholder="blur"
            blurDataURL={primaryImage?.blur_url}
            format="auto"
            height={900}
            src={primaryImage?.public_id}
            width={1600}
            className="h-[40vh] object-cover"
          />
        )}
        <div className="hero-overlay relative z-10 bg-black bg-opacity-60 "></div>
        <div className="hero-content z-20 text-center text-white ">
          <div className="max-w-md">
            <h1 className="mb-5 font-bold text-5xl md:text-7xl">{pageTitle}</h1>
          </div>
        </div>
      </div>
    </section>
  );
}
