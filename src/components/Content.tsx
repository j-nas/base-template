import DOMPurify from "isomorphic-dompurify";
type Props = {
  content?: string;
  className?: string;
};

export default function InlineContent({ content, className }: Props) {
  const clean = DOMPurify.sanitize(content || "", {});
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: clean,
      }}
    ></div>
  );
}
