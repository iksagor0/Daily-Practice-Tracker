import dynamic from "next/dynamic";

function processContent(content: string): string {
  // Preserve extra blank lines with non-breaking space paragraphs
  let processed = content.replace(/\n{3,}/g, (match) => {
    const extraLines = match.length - 2;
    return "\n\n" + " \n\n".repeat(extraLines);
  });
  // Convert single newlines between text lines to Markdown hard line breaks
  // Use lookahead so second char is not consumed, allowing consecutive matches
  processed = processed.replace(/([^\n])\n(?=[^\n])/g, "$1  \n");
  return processed;
}

// Dynamic import to avoid SSR issues and lazy-load the heavy markdown parsers
const MarkdownPreview = dynamic(
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
          {processContent(content)}
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

export default MarkdownPreview;
