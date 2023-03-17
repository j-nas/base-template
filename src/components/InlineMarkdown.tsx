import DOMPurify from "isomorphic-dompurify";
import parse from "html-react-parser";
import React from "react";
type Props = {
  content?: string;
  className?: string;
};

export default function InlineMarkdown({ content, className }: Props) {
  const htmlContent = DOMPurify.sanitize(content || "", {
    FORBID_TAGS: ["style", "script", "iframe", "img", "h1"],
  });

  return <div className={className}> {parse(htmlContent || "")} </div>;
}
