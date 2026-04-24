import { INoteEditorProps } from "@/types/notebook.types";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { Download, Edit3, Eye, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import EmptyState from "./empty-state";
import MarkdownPreview from "./markdown-preview";

const NoteEditor: React.FC<INoteEditorProps> = ({
  note,
  onChange,
  onAddNote,
}) => {
  const [viewMode, setViewMode] = useState<"WRITE" | "PREVIEW">(
    note && note.content ? "PREVIEW" : "WRITE",
  );
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
        ? words
            .slice(0, 4)
            .join("-")
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "")
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
    return <EmptyState onAddNote={onAddNote} />;
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-base_color/80 backdrop-blur-xl rounded-3xl border border-border_color shadow-xl shadow-slate-200/10 overflow-hidden min-h-[500px]">
      {/* Editor Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/50 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-heading_color_secondary tracking-wider bg-base_color/50 px-2.5 py-1 rounded-lg">
            {format(new Date(note.createdAt), "d MMMM, yyyy")}
          </span>
          <span className="text-[10px] font-medium text-disable_color">
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
            className="w-full h-full p-4 lg:p-6 resize-none bg-transparent focus:outline-none text-heading_color_secondary leading-relaxed font-medium placeholder:text-disable_color custom-scrollbar"
            autoFocus
          />
        ) : (
          <div
            id="markdown"
            className="mark-down-preview-wrapper w-full h-full overflow-y-auto p-4 lg:p-6 custom-scrollbar prose prose-slate prose-brand max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-brand-600"
          >
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

export default NoteEditor;
