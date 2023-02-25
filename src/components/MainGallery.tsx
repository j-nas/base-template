import { useState } from "react";

import type { RouterOutputs } from "../utils/api";
import { env } from "../env/client.mjs";
import Image from "next/image";

import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
type Props = {
  gallery: RouterOutputs["gallery"]["getMainGallery"];
};
export default function MainGallery({ gallery }: Props) {
  const [index, setIndex] = useState(-1);
  return (
    <>
      <section className="relative m-4 columns-1 gap-4  sm:columns-2 xl:columns-3 2xl:columns-4">
        {gallery &&
          gallery.map((photo) => {
            return (
              <div key={photo.id} className="">
                <Image
                  width={720}
                  height={720}
                  src={`https://res.cloudinary.com/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${photo.public_Id}.${photo.format}`}
                  alt={photo.altText || ""}
                  className="mb-4 aspect-auto max-h-72 object-cover shadow-2xl hover:brightness-125"
                  placeholder="blur"
                  blurDataURL={photo.blur_url || ""}
                  onClick={() => setIndex(photo.index)}
                  sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
                />
              </div>
            );
          })}
      </section>
      <Lightbox
        carousel={{ preload: 10, imageFit: "cover" }}
        plugins={[Fullscreen, Thumbnails, Zoom]}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={gallery.map((image) => ({
          src: image.public_Id + "." + image.format,
          key: image.id,
          height: image.height,
          width: image.width,
        }))}
        styles={{
          container: {
            backgroundColor: "rgba(0, 0, 0, .8)",
            backdropFilter: "blur(10px)",
            position: "fixed",
          },
        }}
        thumbnails={{
          border: 0,
          padding: 0,
          gap: 0,
          imageFit: "cover",
          width: 50,
        }}
        render={{
          slide: (image, offset, rect) => {
            const width = Math.round(
              Math.min(
                rect.width,
                (rect.height / (image?.height || 1)) * (image?.width || 1)
              )
            );
            const height = Math.round(
              Math.min(
                rect.height,
                (rect.width / (image?.width || 1)) * (image?.height || 1)
              )
            );

            return (
              <div style={{ position: "relative", width, height }}>
                <Image
                  fill
                  src={`https://res.cloudinary.com/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_2560/${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${image.src}`}
                  loading="eager"
                  placeholder="blur"
                  blurDataURL={
                    gallery.filter(
                      (i) => i.public_Id === image.src.split(".")[0]
                    )[0]?.blur_url || ""
                  }
                  alt={image.alt || ""}
                  sizes={
                    typeof window !== "undefined"
                      ? `${Math.ceil((width / window.innerWidth) * 100)}vw`
                      : `${width}px`
                  }
                />
              </div>
            );
          },
          thumbnail: ({ slide, rect }) => {
            const width = Math.round(
              Math.min(
                rect.width,
                (rect.height / (slide.height || 1)) * (slide.width || 1)
              )
            );
            const height = Math.round(
              Math.min(
                rect.height,
                (rect.width / (slide.width || 1)) * (slide.height || 1)
              )
            );

            return (
              <div
                style={{
                  position: "relative",

                  width,
                  height,
                }}
              >
                <Image
                  fill
                  src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_2560/${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${slide.src}`}
                  loading="eager"
                  placeholder="blur"
                  className="border-none"
                  blurDataURL={
                    gallery.filter(
                      (i) => i.public_Id === slide.src.split(".")[0]
                    )[0]?.blur_url || ""
                  }
                  alt={slide?.alt || ""}
                  sizes={
                    typeof window !== "undefined"
                      ? `${Math.ceil((width / window.innerWidth) * 100)}vw`
                      : `${width}px`
                  }
                />
              </div>
            );
          },
        }}
      />
    </>
  );
}
