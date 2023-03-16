import {
  useEditor,
  EditorContent,
  EditorContentProps,
  generateHTML,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link as LinkExtension } from "@tiptap/extension-link";
import {
  MdFormatItalic,
  MdFormatBold,
  MdFormatListNumbered,
  MdFormatListBulleted,
  MdOutlineFormatAlignJustify,
  MdLink,
  MdFormatQuote,
} from "react-icons/md";
import { VscHorizontalRule } from "react-icons/vsc";
import { BiParagraph, BiHeading } from "react-icons/bi";
import { IoMdHelpCircle } from "react-icons/io";
import Link from "next/link";

type Props = {
  content: string;
  setContent: (content: string) => void;
  isDirty: boolean;
};

const MenuBar = ({ editor }: EditorContentProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="menu-bar relative mb-1 flex min-w-full flex-wrap place-items-center gap-x-4 gap-y-2 p-1 focus:outline-base-content">
      <div className="btn-group">
        <div data-tip="bold" className="tooltip">
          <button
            className="btn-outline btn btn-square text-lg"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <MdFormatBold />
          </button>
        </div>
        <div className="tooltip" data-tip="italics">
          <button
            className="btn-outline btn btn-square text-lg"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <MdFormatItalic />
          </button>
        </div>
      </div>
      <div className="btn-group">
        <div className="tooltip" data-tip="Heading level 2">
          <button
            className="btn-outline btn btn-square text-lg"
            onClick={() =>
              editor.chain().focus().setHeading({ level: 2 }).run()
            }
          >
            H2
          </button>
        </div>
        <div className="tooltip" data-tip="Heading level 3">
          <button
            className="btn-outline btn btn-square text-lg"
            onClick={() =>
              editor.chain().focus().setHeading({ level: 3 }).run()
            }
          >
            H3
          </button>
        </div>
        <div className="tooltip" data-tip="Paragraph">
          <button
            className="btn-outline btn btn-square text-lg"
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            <BiParagraph />
          </button>
        </div>
      </div>
      <div className="btn-group">
        <div className="tooltip" data-tip="Bullet list">
          <button
            className="btn-outline btn btn-square text-lg"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <MdFormatListBulleted />
          </button>
        </div>
        <div className="tooltip" data-tip="Numbered list">
          <button
            className="btn-outline btn btn-square text-lg"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <MdFormatListNumbered />
          </button>
        </div>
      </div>
      <div className="btn-group">
        <div className="tooltip" data-tip="Insert Quote">
          <button
            className="btn-outline btn btn-square text-lg"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <MdFormatQuote />
          </button>
        </div>
        <div className="tooltip" data-tip="Insert link">
          <button
            className="btn-outline btn btn-square text-lg"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <MdLink />
          </button>
        </div>
      </div>
      <div className="tooltip" data-tip="Horizontal rule">
        <button
          className="btn-outline btn btn-square text-lg"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <VscHorizontalRule />
        </button>
      </div>
      <div className=" absolute right-2 top-14 z-10 text-xl">
        <span
          data-tip="SEO Tips: Make sure to include areas served, and keywords your customers would likely search for. This helps build your search engine rankings."
          className="tooltip tooltip-left"
        >
          <IoMdHelpCircle />
        </span>
      </div>
    </div>
  );
};

export const Tiptap = ({ content, setContent, isDirty }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit, LinkExtension],
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
