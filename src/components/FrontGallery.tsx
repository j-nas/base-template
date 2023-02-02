import type { RouterOutputs } from "../utils/api";
import { env } from "../env/client.mjs";
import Image from "next/image";

type Props = {
  gallery: RouterOutputs["gallery"]["getFrontPageGallery"];
};
export default function FrontGallery({ gallery }: Props) {
  return (
    <div className="mx-4 columns-3">
      {gallery &&
        gallery.map((photo) => {
          return (
            <div key={photo.id} className="">
              <Image
                width={720}
                height={720}
                src={`https://res.cloudinary.com/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${photo.public_Id}.${photo.format}`}
                alt={photo.altText || ""}
                className="mb-4 aspect-auto max-h-72 object-cover "
                placeholder="blur"
                blurDataURL={photo.blur_url || ""}
              />
            </div>
          );
        })}
    </div>
  );
}
