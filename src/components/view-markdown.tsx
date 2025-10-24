import React from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export default function ViewMarkdown({ text }: { text: string }) {
  return (
    <Markdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
      {text}
    </Markdown>
  );
}
