import { INote } from "@/models";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { FileText, Plus, Trash2 } from "lucide-react";
import React, { useMemo } from "react";
import { Button } from "../atoms";

interface INoteListProps {
  notes: readonly INote[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onAddNote: () => void;
  onDeleteNote: (id: string) => void;
}

export const NoteList: React.FC<INoteListProps> = ({
  notes,
  activeNoteId,
  onSelectNote,
  onAddNote,
  onDeleteNote,
}) => {
  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes]);

  const _renderNoteItem = (note: INote) => {
    const isActive = activeNoteId === note.id;
    // Extract a small snippet from content for the preview
    const previewText = note.content.trim() || "Empty note...";

    return (
      <div
        key={note.id}
        onClick={() => onSelectNote(note.id)}
        className={cn(
          "p-4 rounded-2xl cursor-pointer transition-all border group relative",
          {
            "bg-white border-brand-200 shadow-sm shadow-brand-500/5": isActive,
            "bg-white/50 border-transparent hover:bg-white/80 hover:border-slate-200":
              !isActive,
          },
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4
            className={cn("font-bold text-sm truncate", {
              "text-brand-900": isActive,
              "text-slate-700": !isActive,
            })}
          >
            {previewText.split("\n")[0].substring(0, 40) || "New Note"}
          </h4>
          <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap pt-0.5">
            {format(new Date(note.updatedAt), "MMM d")}
          </span>
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {previewText}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteNote(note.id);
          }}
          className={cn(
            "absolute top-3 right-3 p-1.5 rounded-lg bg-rose-50 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-100",
            { "opacity-100": isActive },
          )}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  return (
    <div className="w-full lg:w-80 flex flex-col h-full bg-slate-50/50 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-slate-200/40 p-4">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-lg font-display font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-500" />
          Notes
        </h2>
        <Button
          onClick={onAddNote}
          className="p-2 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {sortedNotes.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-500">No notes yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Click the + button to create one.
            </p>
          </div>
        ) : (
          sortedNotes.map(_renderNoteItem)
        )}
      </div>
    </div>
  );
};
