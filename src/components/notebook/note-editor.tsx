import { useAppContext } from "@/context/app-context";
import { INoteEditorProps } from "@/types/notebook.types";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { Download, Edit3, Eye, Upload } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import EmptyState from "./empty-state";
import MarkdownPreview from "./markdown-preview";

const NoteEditor: React.FC<INoteEditorProps> = ({
  note,
  onChange,
  onAddNote,
}) => {
  const { state } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [localContent, setLocalContent] = useState(note?.content || "");
  const [viewMode, setViewMode] = useState<"WRITE" | "PREVIEW">(
    note && note.content ? "PREVIEW" : "WRITE",
  );

  const isDark = useMemo(
    () => ["midnight", "nordic-dark", "slate-dark"].includes(state.theme),
    [state.theme],
  );

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
    <div className="w-full h-screen md:h-full md:flex-1 flex flex-col bg-base_color/80 backdrop-blur-xl rounded-3xl border border-border_color shadow-xl shadow-slate-200/10 overflow-hidden">
      {/* Editor Header */}
      <div className="p-4 lg:px-6 lg:py-4 border-b border-border_color/50 flex items-center justify-between bg-base_color/30 flex-wrap gap-2">
        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:gap-2">
          <span className="text-xs font-bold text-heading_color_secondary tracking-wider bg-primary_color/5 py-1 px-2 rounded-lg">
            {format(new Date(note.createdAt), "d MMMM, yyyy")}
          </span>
          <span className="text-[10px] font-medium text-disable_color">
            Last edited: {format(new Date(note.updatedAt), "dd-MM-yyyy hh:mm a")}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* File Operations */}
          <div className="flex items-center gap-1">
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
                  className="p-1.5 rounded-lg text-heading_color_secondary hover:text-primary_color hover:bg-primary_color/10 transition-colors cursor-pointer"
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
                "p-1.5 rounded-lg text-heading_color_secondary hover:text-primary_color hover:bg-primary_color/10 transition-colors cursor-pointer",
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
          <div className="bg-primary_color/5 p-1 rounded-xl flex items-center border border-border_color/20">
            <button
              onClick={() => setViewMode("WRITE")}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                {
                  "bg-base_color text-primary_color shadow-sm":
                    viewMode === "WRITE",
                  "text-heading_color_secondary hover:text-heading_color":
                    viewMode !== "WRITE",
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
                  "bg-base_color text-primary_color shadow-sm":
                    viewMode === "PREVIEW",
                  "text-heading_color_secondary hover:text-heading_color":
                    viewMode !== "PREVIEW",
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
      <div className="flex-1 flex flex-col h-full overflow-hidden relative pb-2 md:pb-0">
        {viewMode === "WRITE" ? (
          <textarea
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            placeholder="Write down your daily reflections, study notes, or brainstorm ideas using Markdown..."
            className="flex-1 min-h-[400px] h-full w-full p-4 lg:p-6 resize-none bg-transparent focus:outline-none text-heading_color_secondary leading-relaxed font-medium placeholder:text-disable_color custom-scrollbar"
            autoFocus
          />
        ) : (
          <div
            id="markdown"
            className={cn(
              "mark-down-preview-wrapper flex-1 w-full overflow-y-auto p-4 lg:p-6 custom-scrollbar prose max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-primary_color min-h-[400px] lg:min-h-0",
              {
                "prose-invert": isDark,
                "prose-slate": !isDark,
              },
            )}
          >
            {localContent ? (
              <MarkdownPreview content={localContent} />
            ) : (
              <div className="text-disable_color italic">
                Nothing to preview...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;
