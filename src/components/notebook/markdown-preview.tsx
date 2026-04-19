import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues and lazy-load the heavy markdown parsers
export const MarkdownPreview = dynamic(
  async () => {
    const ReactMarkdown = (await import("react-markdown")).default;
    const remarkGfm = (await import("remark-gfm")).default;
    return function Preview({ content }: { content: string }) {
      return (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ node, ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer" />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      );
    };
  },
  {
    ssr: false,
    loading: () => (
      <div className="text-slate-400 italic">Loading preview...</div>
    ),
  },
);
