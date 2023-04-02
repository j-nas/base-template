import DOMPurify from "isomorphic-dompurify";
import parse from "html-react-parser";
import React from "react";
type Props = {
  content?: string;
  className?: string;
  allowImages?: boolean;
};

export default function InlineHTML({ content, className, allowImages }: Props) {
  const img = allowImages ? "" : "img";

  const htmlContent = DOMPurify.sanitize(content || "", {
    FORBID_TAGS: ["style", "script", "iframe", "h1", img],
  });

  return <div className={className}> {parse(htmlContent || "")} </div>;
}
