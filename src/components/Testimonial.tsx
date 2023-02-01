import { type Testimonial } from "@prisma/client";
import Image from "next/image";
import { env } from "../env/client.mjs";

type Props = {
  testimonial: {
    AvatarImage?:
      | {
          image: {
            public_Id: string;
            format: string;
            id: string;
            width: number;
            height: number;
          };
          id: string;
        }[]
      | undefined;
    id: string;
    name: string;
    title: string;
    quote: string;
    highlighted: boolean;
  };
};

export default function Testimonial(props: Props) {
  const {
    testimonial: { id, name, title, quote, AvatarImage = [] },
  } = props;

  const { public_Id, format } = AvatarImage[0]?.image ?? {
    format: "",
    public_Id: "",
  };

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
        src={`https://res.cloudinary.com/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/q_80/w_80,h_80,c_fill,g_face/${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${public_Id}.${format}`}
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
      className="relative mx-8 mt-12 rounded-lg bg-base-300 p-6 shadow-2xl md:mx-auto md:w-1/2 lg:w-full"
    >
      {public_Id !== "" ? avatar : placeholder}
      <div className="grid grid-cols-2 ">
        <p className="col-span-2 border-b-2 border-secondary pb-4 pt-8">
          {quote}
        </p>
        <div className="">
          <div className="flex flex-col  text-left">
            <span className="font-medium">{name}</span>
            <span className="text-base">{title}</span>
          </div>
        </div>
        <div className="flex justify-end ">
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
