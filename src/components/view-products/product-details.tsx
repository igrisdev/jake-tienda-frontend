"use client";

import { Suspense } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface Props {
  description: string;
}

export default function ProductDetails({ description }: Props) {
  return (
    <Suspense fallback={<div className="h-full"></div>}>
      <div className="space-y-6">
        <article className="prose prose-sm max-w-none">
          <Markdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
            {description}
          </Markdown>
        </article>
      </div>
    </Suspense>
  );
}
