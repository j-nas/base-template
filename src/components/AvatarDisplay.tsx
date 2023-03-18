import { CldImage } from "next-cloudinary";
import { env } from "../env/client.mjs";

type Props = {
  public_id?: string;
  size: "10" | "20";
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
          <div className="relative w-10 rounded-full bg-neutral-focus text-neutral-content">
            {name.split(" ").map((n) => n[0] ?? "")}
          </div>
        </div>
      )}
    </>
  );
}
