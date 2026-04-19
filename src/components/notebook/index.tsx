import { useAppContext } from "@/context/app-context";
import { INote } from "@/models";
import React, { useState } from "react";
import { NoteEditor } from "./note-editor";
import { NoteList } from "./note-list";

export const Notebook: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const handleAddNote = () => {
    const newNote: INote = {
      id: "note_" + Date.now(),
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    dispatch({ type: "ADD_NOTE", payload: newNote });
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this note?")) {
      dispatch({ type: "DELETE_NOTE", payload: id });
      if (activeNoteId === id) {
        setActiveNoteId(null);
      }
    }
  };

  const handleUpdateNote = (id: string, newContent: string) => {
    const existing = state.notes.find((n) => n.id === id);
    if (!existing) return;

    if (existing.content !== newContent) {
      dispatch({
        type: "EDIT_NOTE",
        payload: {
          ...existing,
          content: newContent,
          updatedAt: Date.now(),
        },
      });
    }
  };

  const activeNote = state.notes.find((n) => n.id === activeNoteId) || null;

  return (
    <div className="w-full h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 animate-fade-in fill-mode-forwards">
      <NoteList
        notes={state.notes}
        activeNoteId={activeNoteId}
        onSelectNote={setActiveNoteId}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
      />
      <NoteEditor key={activeNoteId || "empty"} note={activeNote} onChange={handleUpdateNote} />
    </div>
  );
};
