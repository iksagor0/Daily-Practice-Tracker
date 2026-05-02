import { INote } from "@/models/notebook.model";

export interface INoteListProps {
  notes: readonly INote[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onAddNote: (content?: string) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  showArchived: boolean;
  onToggleShowArchived: (val: boolean) => void;
}

export interface INoteEditorProps {
  note: INote | null;
  onChange: (id: string, content: string) => void;
  onAddNote?: (content?: string) => void;
}

export interface INoteCardProps {
  note: INote;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onCustomDragStart?: (e: React.PointerEvent) => void;
  isHidden?: boolean;
}

export interface IEmptyStateProps {
  onAddNote?: (content?: string) => void;
}
