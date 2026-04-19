import { INote } from "@/models/notebook";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { Download, Edit3, Eye, Plus, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../atoms";
import { MarkdownPreview } from "./markdown-preview";

interface INoteEditorProps {
  note: INote | null;
  onChange: (id: string, content: string) => void;
  onAddNote?: (content?: string) => void;
}

const MARKDOWN_EXAMPLE = `# Markdown Guide

## Text Formatting
**Bold text** and *italic text*.
~~Strikethrough~~ and \`inline code\`.

## Lists
- Item 1
- Item 2
  - Sub-item A

1. First
2. Second

## Links & Images
[Visit Google](https://google.com)

## Checklists
- [x] Task completed
- [ ] Task pending

## Blockquotes
> Focus on progress, not perfection.
`;

export const NoteEditor: React.FC<INoteEditorProps> = ({
  note,
  onChange,
  onAddNote,
}) => {
  const [viewMode, setViewMode] = useState<"WRITE" | "PREVIEW">("WRITE");
  const [localContent, setLocalContent] = useState(note?.content || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (note && localContent !== note.content) {
        onChange(note.id, localContent);
      }
    }, 500); // debounce save
    return () => clearTimeout(timeout);
  }, [localContent, note, onChange]);

  const handleExport = () => {
    if (!note || !localContent.trim()) return;

    // Generate filename: first 4 words + date
    const cleanContent = localContent
      .trim()
      .replace(/[#*`~>]/g, "") // Strip markdown characters for the name
      .replace(/\s+/g, " ");

    const words = cleanContent.split(" ").filter(Boolean);
    const namePart =
      words.length > 0
        ? words.slice(0, 4).join("-").toLowerCase().replace(/[^a-z0-9-]/g, "")
        : "untitled";

    const fileName = `${namePart}-${format(new Date(), "yyyy-MM-dd")}.md`;

    const blob = new Blob([localContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !note) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setLocalContent(content);
      onChange(note.id, content);
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white/50 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-slate-200/40 p-8 h-full min-h-[500px]">
        <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-4 transform -rotate-6">
          <Edit3 className="w-8 h-8 text-brand-300" />
        </div>
        <h3 className="text-xl font-display font-bold text-slate-700 mb-2">
          Select or create a note
        </h3>
        <p className="text-sm text-slate-500 text-center max-w-sm mb-6">
          Write down your daily reflections, study notes, or brainstorm ideas
          using Markdown.
        </p>
        {onAddNote && (
          <div className="flex flex-col items-center gap-3 w-full max-w-[320px]">
            <Button
              onClick={() => onAddNote()}
              className="w-full px-6 py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
            >
              <Plus className="w-5 h-5" />
              Create Note
            </Button>

            <div className="w-full space-y-1 pt-5 mt-6 border-t border-slate-200 opacity-70">
              <div className="flex items-center gap-3 text-slate-400 font-medium">
                <span className="text-brand-500">#</span>
                <span>Main Title</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 font-medium">
                <span className="text-brand-500">##</span>
                <span>Section Header</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 font-medium">
                <span className="text-brand-500">###</span>
                <span>Sub-section</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 font-medium">
                <span className="text-brand-500">**</span>
                <span>Bold Text</span>
                <span className="text-brand-500">**</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 font-medium">
                <span className="text-brand-500">-</span>
                <span>List Item</span>
              </div>
            </div>

            <button
              onClick={() => onAddNote(MARKDOWN_EXAMPLE)}
              className="text-xs font-bold text-slate-400 hover:text-brand-600 border border-slate-200 hover:border-brand-200 px-4 py-2 rounded-lg transition-all"
            >
              Write Example of markdown file
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      id="markdown"
      className="flex-1 flex flex-col h-full bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-slate-200/40 overflow-hidden min-h-[500px]"
    >
      {/* Editor Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/50 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 tracking-wider bg-slate-100 px-2.5 py-1 rounded-lg">
            {format(new Date(note.createdAt), "d MMMM, yyyy")}
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            Last edited {format(new Date(note.updatedAt), "hh:mm a")}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* File Operations */}
          <div className="flex items-center gap-1 mr-2">
            {!localContent && (
              <>
                <input
                  type="file"
                  accept=".md,.txt"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImport}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer"
                  title="Import Markdown"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={handleExport}
              disabled={!localContent.trim()}
              className={cn(
                "p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer",
                {
                  "opacity-30 cursor-not-allowed pointer-events-none":
                    !localContent.trim(),
                },
              )}
              title="Export as Markdown"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* View Toggle */}
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
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-hidden relative">
        {viewMode === "WRITE" ? (
          <textarea
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            placeholder="Write down your daily reflections, study notes, or brainstorm ideas using Markdown..."
            className="w-full h-full p-4 lg:p-6 resize-none bg-transparent focus:outline-none text-slate-700 leading-relaxed font-medium placeholder:text-slate-300 custom-scrollbar"
            autoFocus
          />
        ) : (
          <div className="w-full h-full overflow-y-auto p-4 lg:p-6 custom-scrollbar prose prose-slate prose-brand max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-brand-600">
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
