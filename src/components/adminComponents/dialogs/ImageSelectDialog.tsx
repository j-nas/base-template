import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdCloseCircle } from "react-icons/io";
import * as icons from "react-icons/fa";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { api } from "../../../utils/api";
import LoadingSpinner from "../../LoadingSpinner";
import { CldImage } from "next-cloudinary";
import { env } from "../../../env/client.mjs";

type Props = {
  children: React.ReactNode;
  position: "primary" | "secondary" | "hero";
  handleImageChange: (
    value: string,
    position: "primary" | "secondary" | "hero"
  ) => void;
};

export default function ImageSelectDialog({
  children,
  handleImageChange,
  position,
}: Props) {
  const { isLoading, data } = api.image.getAllImages.useQuery();
  const [parent, toggleAnimations] = useAutoAnimate();
  const [selectedImage, setSelectedImage] = React.useState<string>("");
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className=" fixed inset-0 z-40 h-screen w-screen bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[80vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-base-300 p-6  drop-shadow-xl">
          <Dialog.Title className="font-bold text-lg">
            Select {position} image
          </Dialog.Title>
          {/* <div className="mt-6 w-full place-content-center md:flex">help</div> */}
          <div className="m-2 flex h-[40vh] flex-wrap place-content-start overflow-auto rounded-lg bg-base-100 text-base-content drop-shadow-2xl scrollbar-thin scrollbar-track-base-100 scrollbar-thumb-primary scrollbar-track-rounded-lg md:m-8">
            {isLoading ? (
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              data?.map((image) => (
                <button
                  key={image.public_id}
                  className={`btn-outline btn btn-square  m-2 h-24 w-24 cursor-pointer p-1 ${
                    selectedImage === image.public_id && "btn-primary"
                  }`}
                  onClick={() => setSelectedImage(image.public_id)}
                >
                  <div className="overflow-hidden rounded-lg">
                    <CldImage
                      src={
                        env.NEXT_PUBLIC_CLOUDINARY_FOLDER +
                        "/" +
                        image.public_id
                      }
                      alt={image.public_id}
                      className="rounded-lg object-cover transition-all hover:scale-110"
                      crop="thumb"
                      placeholder="blur"
                      blurDataURL={image.blur_url}
                      height={100}
                      width={100}
                    />
                  </div>
                </button>
              ))
            )}
          </div>
          <span>Selected image: {selectedImage}</span>
          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <button aria-label="cancel" className={`btn btn-warning `}>
                Cancel
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                onClick={() => handleImageChange(selectedImage, position)}
                className="btn btn-primary ml-2"
              >
                Accept
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              className="btn btn-ghost btn-circle absolute top-3 right-3"
              aria-label="Close"
            >
              <IoMdCloseCircle className="text-xl" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
