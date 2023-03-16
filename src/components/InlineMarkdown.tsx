import DOMPurify from "isomorphic-dompurify";
type Props = {
  content?: string;
  className?: string;
};

export default function InlineMarkdown({ content, className }: Props) {
  const clean = DOMPurify.sanitize(content || "", {
    FORBID_TAGS: ["style", "img"],
  });
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: clean,
      }}
    ></div>
  );
}
