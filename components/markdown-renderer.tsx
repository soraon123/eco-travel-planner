"use client"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      className={cn("prose prose-green max-w-none dark:prose-invert", className)}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-2 text-green-800" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-3 mb-2 text-green-700" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-md font-bold mt-2 mb-1 text-green-600" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
        li: ({ node, ...props }) => <li className="my-1" {...props} />,
        p: ({ node, ...props }) => <p className="my-2" {...props} />,
        a: ({ node, ...props }) => (
          <a
            className="text-green-600 hover:text-green-800 underline"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-green-200 pl-4 italic my-2" {...props} />
        ),
        code: ({ node, inline, ...props }) =>
          inline ? (
            <code className="bg-green-50 px-1 py-0.5 rounded text-green-800 text-sm" {...props} />
          ) : (
            <code className="block bg-green-50 p-2 rounded text-green-800 text-sm overflow-x-auto my-2" {...props} />
          ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
