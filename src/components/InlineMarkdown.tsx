import md from "markdown-it";

type Props = {
  content?: string;
  className?: string;
};

export default function InlineMarkdown({ content, className }: Props) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: md({ breaks: true })
          .disable(["image"])
          .render(content || ""),
      }}
    ></div>
  );
}
