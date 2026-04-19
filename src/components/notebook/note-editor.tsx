import { INote } from "@/models";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { Edit3, Eye } from "lucide-react";
import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues and lazy-load the heavy markdown parsers
const MarkdownPreview = dynamic(
  async () => {
    const ReactMarkdown = (await import("react-markdown")).default;
    const remarkGfm = (await import("remark-gfm")).default;
    return function Preview({ content }: { content: string }) {
      return (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      );
    };
  },
  {
    ssr: false,
    loading: () => <div className="text-slate-400 italic">Loading preview...</div>,
  }
);

interface INoteEditorProps {
  note: INote | null;
  onChange: (id: string, content: string) => void;
}

export const NoteEditor: React.FC<INoteEditorProps> = ({ note, onChange }) => {
  const [viewMode, setViewMode] = useState<"WRITE" | "PREVIEW">("WRITE");
  const [localContent, setLocalContent] = useState(note?.content || "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (note && localContent !== note.content) {
        onChange(note.id, localContent);
      }
    }, 500); // debounce save
    return () => clearTimeout(timeout);
  }, [localContent, note, onChange]);

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white/50 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-slate-200/40 p-8 h-full min-h-[500px]">
        <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-4 transform -rotate-6">
          <Edit3 className="w-8 h-8 text-brand-300" />
        </div>
        <h3 className="text-xl font-display font-bold text-slate-700 mb-2">
          Select or create a note
        </h3>
        <p className="text-sm text-slate-500 text-center max-w-sm">
          Write down your daily reflections, study notes, or brainstorm ideas
          using Markdown.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-slate-200/40 overflow-hidden min-h-[500px]">
      {/* Editor Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-lg">
            {format(new Date(note.createdAt), "MMM d, yyyy")}
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            Last edited {format(new Date(note.updatedAt), "HH:mm")}
          </span>
        </div>

        <div className="bg-slate-100/80 p-1 rounded-xl flex items-center">
          <button
            onClick={() => setViewMode("WRITE")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
              {
                "bg-white text-brand-600 shadow-sm": viewMode === "WRITE",
                "text-slate-500 hover:text-slate-700": viewMode !== "WRITE",
              },
            )}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Write
          </button>
          <button
            onClick={() => setViewMode("PREVIEW")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
              {
                "bg-white text-brand-600 shadow-sm": viewMode === "PREVIEW",
                "text-slate-500 hover:text-slate-700": viewMode !== "PREVIEW",
              },
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-hidden relative">
        {viewMode === "WRITE" ? (
          <textarea
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            placeholder="Start writing using Markdown..."
            className="w-full h-full p-6 lg:p-8 resize-none bg-transparent focus:outline-none text-slate-700 leading-relaxed font-medium placeholder:text-slate-300 custom-scrollbar"
            autoFocus
          />
        ) : (
          <div className="w-full h-full overflow-y-auto p-6 lg:p-8 custom-scrollbar prose prose-slate prose-brand max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-brand-600">
            {localContent ? (
              <MarkdownPreview content={localContent} />
            ) : (
              <div className="text-slate-400 italic">Nothing to preview...</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
