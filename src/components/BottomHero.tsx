import CldImg from "./CldImg";
import type { RouterOutputs } from "../utils/api";

type Props = {
  hero: RouterOutputs["hero"]["getByPosition"];
  businessName: string;
};

export const HeroBanner = ({
  hero: {
    PrimaryImage: { blur_url, format, public_Id, id },
    heading,
    ctaText,
  },
  businessName,
}: Props) => {
  return (
    <section className={`mx-0 mt-32 md:mx-14`}>
      <div className={`hero`}>
        <CldImg
          alt="hero image"
          blur={blur_url}
          format={format}
          height={600}
          public_Id={public_Id}
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
            <h2 className="mb-5 text-5xl font-bold md:text-7xl">{heading}</h2>
            <p className="mb-5 text-xl">{ctaText}</p>
            <button className="btn-primary btn rounded-none">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
