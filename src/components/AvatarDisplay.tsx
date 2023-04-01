import { CldImage } from "next-cloudinary";
import { env } from "../env/client.mjs";

const sizes = {
  10: "w-10 h-10",
  20: "w-20 h-20 text-xl",
  30: "w-30 h-30 text-2xl",
};

type Props = {
  public_id?: string;
  size: keyof typeof sizes;
  name: string;
};

export default function AvatarDisplay({ public_id, size, name }: Props) {
  return (
    <>
      {public_id ? (
        <div className={`avatar max-w-fit justify-self-start p-2 `}>
          <div className={`relative w-${size} rounded-full`}>
            <CldImage
              src={env.NEXT_PUBLIC_CLOUDINARY_FOLDER + "/" + public_id}
              // fill
              height={228}
              width={228}
              alt={name}
              className="rounded-t-lg"
              gravity={"faces"}
              crop={"thumb"}
              format={"auto"}
            />
          </div>
        </div>
      ) : (
        <div className="placeholder avatar max-w-fit justify-self-start p-2 ">
          <div
            className={` relative w-${sizes[size]}  rounded-full bg-neutral-focus text-neutral-content`}
          >
            {name.split(" ").map((n) => n[0] ?? "")}
          </div>
        </div>
      )}
    </>
  );
}
