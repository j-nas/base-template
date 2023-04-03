import { useState } from "react";
import { CldImage } from "next-cloudinary";

import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";
type Props = {
  gallery: {
    public_id: string;
    altText: string;
    blur_url: string;
    index: number;
    height: number;
    width: number;
  }[];
};
export default function MainGallery({ gallery }: Props) {
  const [index, setIndex] = useState(-1);
  return (
    <>
      <section className="relative m-4 columns-1 gap-4  sm:columns-2 xl:columns-3 2xl:columns-4">
        {gallery &&
          gallery.map((photo) => {
            return (
              <div key={photo.index} className="">
                <CldImage
                  width={720}
                  height={720}
                  src={photo.public_id}
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
        plugins={[Fullscreen, Thumbnails, Zoom, Captions]}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={gallery.map((image) => ({
          src: image.public_id,
          key: image.index,
          height: image.height,
          width: image.width,
          title: image.altText,
          description: image.altText,
        }))}
        styles={{
          container: {
            backgroundColor: "rgba(0, 0, 0, .8)",
            backdropFilter: "blur(10px)",
            position: "fixed",
          },
          captionsDescriptionContainer: {
            bottom: "7em",
            // backgroundColor: "red",
            position: "absolute",
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
          slide: (image, _offset, rect) => {
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
                <CldImage
                  fill
                  src={image.src}
                  loading="eager"
                  placeholder="blur"
                  blurDataURL={
                    gallery.filter(
                      (i) => i.public_id === image.src.split(".")[0]
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
                <CldImage
                  width={100}
                  height={100}
                  src={`${slide.src}`}
                  loading="eager"
                  placeholder="blur"
                  className="border-none"
                  blurDataURL={
                    gallery.find((i) => i.public_id === slide.src.split(".")[0])
                      ?.blur_url || ""
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
