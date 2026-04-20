import { INote } from "@/models/notebook.model";

export interface INoteListProps {
  notes: readonly INote[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onAddNote: (content?: string) => void;
  onDeleteNote: (id: string) => void;
}

export interface INoteEditorProps {
  note: INote | null;
  onChange: (id: string, content: string) => void;
  onAddNote?: (content?: string) => void;
}

export interface INoteItemProps {
  note: INote;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface IEmptyStateProps {
  onAddNote?: (content?: string) => void;
}
