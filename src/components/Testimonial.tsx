import { type Testimonial } from "@prisma/client";
import Image from "next/image";
import { env } from "../env/client.mjs";
import { type RouterOutputs } from "../utils/api";

type Props = RouterOutputs["testimonial"]["getById"];

export default function Testimonial(props: Props) {
  const { id, name, image, company, quote, title } = props;
  const { public_id, format } = image ?? {};

  const placeholder = (
    <div className="placeholder avatar absolute -top-8 left-8">
      <div className="w-16 rounded-full bg-neutral-focus text-neutral-content">
        <span className="text-xl">
          {name.split(" ").map((n) => n[0] ?? "")}
        </span>
      </div>
    </div>
  );

  const avatar = (
    <div className=" absolute -top-8 left-8">
      <Image
        src={`https://res.cloudinary.com/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/q_80/w_80,h_80,c_fill,g_face/${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${public_id}.${format}`}
        alt={name}
        width={80}
        height={80}
        className="w-20 rounded-full"
      />
    </div>
  );

  return (
    <div
      key={id}
      className="relative mx-auto  mt-12 w-full rounded-lg bg-base-300 p-6 shadow-2xl"
    >
      {image !== null ? avatar : placeholder}
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
