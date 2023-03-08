import CldImg from "./CldImg";
import type { RouterOutputs } from "../utils/api";

type Props = {
  hero: RouterOutputs["hero"]["getByPosition"];
  pageTitle: string;
};

export default function TopHero({
  hero: {
    primaryImage: { blur_url, format, id, height, public_id, width },
  },
  pageTitle,
}: Props) {
  return (
    <section className="">
      <div className=" hero relative min-h-[40vh]  ">
        <CldImg
          alt={pageTitle}
          blur={blur_url}
          format={format}
          id={id}
          height={height}
          public_id={public_id}
          width={width}
          className="h-[40vh] object-cover"
        />
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
