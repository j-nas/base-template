import {
  EditorContent,
  type EditorContentProps,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import {
  MdFormatItalic,
  MdFormatBold,
  MdFormatListNumbered,
  MdFormatListBulleted,
  MdLink,
  MdFormatQuote,
  MdImage,
} from "react-icons/md";
import { VscHorizontalRule } from "react-icons/vsc";
import { BiParagraph } from "react-icons/bi";
import { IoMdHelpCircle } from "react-icons/io";
// import Link from "next/link";
import React from "react";
import { env } from "~/env/client.mjs";

import LinkInsertDialog from "./dialogs/LinkInsertDialog";
import ImageSelectDialog from "./dialogs/ImageSelectDialog";

type Props = {
  content: string;
  setContent: (content: string) => void;
  isDirty: boolean;
};

export const Tiptap = ({ content, setContent, isDirty }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit, Link, Image],
    content: content,
    editorProps: {
      attributes: {
        class:
          " place-self-stretch min-w-full min-h-fit  rounded-b-lg p-2 h-96 prose-sm md:prose place-self-center bg-base-300 overflow-auto",
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  Link.configure({
    HTMLAttributes: {
      class: "link cursor-pointer z-20",
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div
      className={`${
        isDirty ? "textarea-success" : "textarea-bordered"
      } min-h textarea flex  flex-col p-1 lg:place-self-stretch`}
    >
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;

function MenuBar({ editor }: EditorContentProps) {
  const setLink = React.useCallback(
    (link: string) => {
      const url = link;
      if (!editor) return null;
      if (url === null) {
        return;
      }

      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }

      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    },
    [editor]
  );

  const setImage = React.useCallback(
    (image: string) => {
      if (!editor) return null;
      if (image === null) {
        return;
      }
      if (image) {
        editor
          .chain()
          .focus()
          .setImage({
            src: `https://res.cloudinary.com/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/f_auto,q_70,c_scale,w_800/${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${image}`,
            alt: image.replace(/_-/g, " "),
          })
          .run();
        return;
      }
    },
    [editor]
  );
  if (!editor) {
    return null;
  }
  return (
    <div className="menu-bar relative mb-1 flex min-w-full flex-wrap place-items-center gap-x-4 gap-y-2 p-1 focus:outline-base-content">
      <div className="btn-group">
        <div data-tip="bold" className="tooltip">
          <button
            className={`btn-outline btn btn-sm btn-square rounded-none text-lg ${
              editor.isActive("bold") ? "btn-active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <MdFormatBold />
          </button>
        </div>
        <div className="tooltip" data-tip="italics">
          <button
            className={`btn-outline btn btn-sm btn-square rounded-none text-lg ${
              editor.isActive("italic") ? "btn-active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <MdFormatItalic />
          </button>
        </div>
      </div>
      <div className="btn-group">
        <div className="tooltip" data-tip="Heading level 2">
          <button
            className={`text-md btn-outline btn btn-sm btn-square place-content-center rounded-none ${
              editor.isActive("heading", { level: 2 }) ? "btn-active" : ""
            }`}
            onClick={() =>
              editor.chain().focus().setHeading({ level: 2 }).run()
            }
          >
            H2
          </button>
        </div>
        <div className="tooltip" data-tip="Heading level 3">
          <button
            className={`text-md btn-outline btn btn-sm btn-square place-content-center rounded-none ${
              editor.isActive("heading", { level: 3 }) ? "btn-active" : ""
            }`}
            onClick={() =>
              editor.chain().focus().setHeading({ level: 3 }).run()
            }
          >
            H3
          </button>
        </div>
        <div className="tooltip" data-tip="Paragraph">
          <button
            className={`btn-outline btn btn-sm btn-square rounded-none text-lg ${
              editor.isActive("paragraph") ? "btn-active" : ""
            }`}
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            <BiParagraph />
          </button>
        </div>
      </div>
      <div className="btn-group">
        <div className="tooltip" data-tip="Bullet list">
          <button
            className={`btn-outline btn btn-sm btn-square rounded-none text-lg ${
              editor.isActive("bulletList") ? "btn-active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <MdFormatListBulleted />
          </button>
        </div>
        <div className="tooltip" data-tip="Numbered list">
          <button
            className={`btn-outline btn btn-sm btn-square rounded-none text-lg ${
              editor.isActive("orderedList") ? "btn-active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <MdFormatListNumbered />
          </button>
        </div>
      </div>
      <div className="btn-group">
        <div className="tooltip" data-tip="Insert Quote">
          <button
            className={`btn-outline btn btn-sm btn-square rounded-none text-lg ${
              editor.isActive("blockquote") ? "btn-active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <MdFormatQuote />
          </button>
        </div>
        {editor.isActive("link") ? (
          <div className="tooltip" data-tip="Remove link">
            <button
              className={`btn-outline btn btn-active btn-sm btn-square rounded-none text-lg`}
              onClick={() => editor.chain().focus().unsetLink().run()}
            >
              <MdLink />
            </button>
          </div>
        ) : (
          <div className="tooltip" data-tip="Insert link">
            <LinkInsertDialog
              previousUrl={editor.getAttributes("link")?.href as string}
              setLink={setLink}
            >
              <button
                className={`btn-outline btn btn-sm btn-square rounded-none text-lg `}
              >
                <MdLink />
              </button>
            </LinkInsertDialog>
          </div>
        )}
        <div className="tooltip" data-tip="Insert image">
          <ImageSelectDialog handleImageChange={setImage} position="primary">
            <button
              className={`btn-outline btn btn-sm btn-square rounded-none text-lg `}
            >
              <MdImage />
            </button>
          </ImageSelectDialog>
        </div>
      </div>
      <div className="tooltip" data-tip="Horizontal rule">
        <button
          className={`btn-outline btn btn-sm btn-square rounded-none text-lg ${
            editor.isActive("bold") ? "btn-active" : ""
          }`}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <VscHorizontalRule />
        </button>
      </div>
      <div className=" absolute right-2 -top-8 z-10 text-xl">
        <span
          data-tip="SEO Tips: Make sure to include areas served, and keywords your customers would likely search for. This helps build your search engine rankings."
          className="tooltip tooltip-left"
        >
          <IoMdHelpCircle />
        </span>
      </div>
    </div>
  );
}
