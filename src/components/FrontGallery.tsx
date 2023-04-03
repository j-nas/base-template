import { CldImage } from "next-cloudinary";

type Props = {
  gallery: {
    public_id: string;
    altText: string;
    blur_url: string;
  }[];
};
export default function FrontGallery({ gallery }: Props) {
  return (
    <div className="mx-4 columns-3">
      {gallery &&
        gallery.map((photo) => {
          return (
            <div key={photo.public_id} className="">
              <CldImage
                width={720}
                height={720}
                src={photo.public_id}
                alt={photo.altText}
                className="mb-4 aspect-auto max-h-72 object-cover "
                placeholder="blur"
                blurDataURL={photo.blur_url}
              />
            </div>
          );
        })}
    </div>
  );
}
