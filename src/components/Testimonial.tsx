import { type Testimonial } from "@prisma/client";
import { type RouterOutputs } from "../utils/api";
import AvatarDisplay from "./AvatarDisplay";

type Props = RouterOutputs["testimonial"]["getById"];

export default function Testimonial(props: Props) {
  const { id, name, image, company, quote, title } = props;
  const { public_id } = image ?? {};

  return (
    <div
      key={id}
      className="relative mx-auto  mt-12 w-full rounded-lg bg-base-300 p-6 shadow-2xl"
    >
      <AvatarDisplay public_id={public_id} name={name} size={20} />
      <div className="grid grid-cols-2 grid-rows-3  sm:grid-rows-none">
        <p className="col-span-2 border-b-2 border-secondary pb-4 pt-8">
          {quote}
        </p>
        <div className="col-span-2 self-stretch sm:col-span-1">
          <div className="flex flex-col text-left">
            <span className="font-normal text-base">{name}</span>
            <span className="font-light text-sm after:content-[',']">
              {company}
            </span>
            <span className="font-light text-sm">{title}</span>
          </div>
        </div>
        <div className="col-span-2 row-start-3 flex max-h-fit justify-center p-0 sm:col-span-1 sm:row-start-auto sm:justify-end ">
          <div className="mask mask-star w-6 bg-warning text-base"></div>
          <div className="mask mask-star w-6 bg-warning text-base"></div>
          <div className="mask mask-star w-6 bg-warning text-base"></div>
          <div className="mask mask-star w-6 bg-warning text-base"></div>
          <div className="mask mask-star w-6 bg-warning text-base"></div>
        </div>
      </div>
    </div>
  );
}
