import { INoteListProps } from "@/types/notebook.types";
import { FileText, Plus } from "lucide-react";
import React, { useMemo } from "react";
import Button from "../atoms/button";
import SingleNoteItem from "./single-note-item";

const NoteList: React.FC<INoteListProps> = ({
  notes,
  activeNoteId,
  onSelectNote,
  onAddNote,
  onDeleteNote,
}) => {
  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes]);

  return (
    <div className="w-full lg:w-80 flex flex-col h-full bg-slate-50/60 backdrop-blur-lg rounded-3xl border border-white/60 shadow-xl shadow-slate-200/40 p-4">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-lg font-display font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-500" />
          Notes
        </h2>
        <Button
          onClick={() => onAddNote()}
          className="p-1.5 rounded-xl bg-white border border-slate-200 shadow-sm text-brand-600 hover:bg-slate-50 transition-colors cursor-pointer"
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
          sortedNotes.map((note) => (
            <SingleNoteItem
              key={note.id}
              note={note}
              isActive={activeNoteId === note.id}
              onSelect={onSelectNote}
              onDelete={onDeleteNote}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NoteList;
