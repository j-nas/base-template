import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdCloseCircle } from "react-icons/io";
import * as icons from "react-icons/fa";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { DebounceInput } from "react-debounce-input";

type Props = {
  children: React.ReactNode;
  handleIconChange: (value: string) => void;
};

export default function IconSelectDialog({
  children,
  handleIconChange,
}: Props) {
  const [parent, toggleAnimations] = useAutoAnimate();
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [selectedIcon, setSelectedIcon] = React.useState<string>("");

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className=" fixed inset-0 z-40 h-screen w-screen bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[80vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-base-100/50 p-6 drop-shadow-xl  backdrop-blur-3xl">
          <Dialog.Title className="font-bold text-lg">Select Icon</Dialog.Title>
          <div className="mt-6 w-full place-content-center md:flex">
            <label htmlFor="icon-search" className="label">
              Search
            </label>
            <DebounceInput
              minLength={0}
              debounceTimeout={500}
              id="icon-search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="input ml-2"
              type="search"
            />
          </div>
          <div className="m-8 flex h-[40vh] flex-wrap place-content-start overflow-auto rounded-lg bg-base-100 text-base-content scrollbar-thin scrollbar-track-base-100 scrollbar-thumb-primary scrollbar-track-rounded-lg">
            {Object.keys(icons)
              .filter((icon) =>
                icon.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((icon) => {
                const Icon = icons[icon as keyof typeof icons];
                return (
                  <button
                    key={icon}
                    onClick={() => {
                      console.log(icon);
                      setSelectedIcon(icon);
                    }}
                    className={`btn-outline btn btn-square m-2 ${
                      selectedIcon === icon && "btn-primary"
                    }`}
                  >
                    <Icon className="h-8 w-8" />
                  </button>
                );
              })}
          </div>
          {selectedIcon && selectedIcon}

          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <button aria-label="cancel" className={`btn btn-warning `}>
                Cancel
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                onClick={() => handleIconChange(selectedIcon)}
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
