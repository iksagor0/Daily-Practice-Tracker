import { useAppContext } from "@/context/app-context";
import { INote } from "@/models/notebook.model";
import { IDragState, INoteListProps } from "@/types";
import { FileText, Plus } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../atoms/button";
import SingleNoteCard from "./single-note-card";

const NoteList: React.FC<INoteListProps> = ({
  notes,
  activeNoteId,
  onSelectNote,
  onAddNote,
  onDeleteNote,
  onTogglePin,
}) => {
  const { dispatch } = useAppContext();
  const [dragState, setDragState] = useState<IDragState<INote> | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const pinnedNotes = useMemo(() => notes.filter((n) => n.pinned), [notes]);
  const unpinnedNotes = useMemo(() => notes.filter((n) => !n.pinned), [notes]);

  const handlePointerDown = (
    e: React.PointerEvent,
    id: string,
    note: INote,
  ) => {
    if (e.button !== 0) return; // Only allow left clicks

    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const card = target.closest("[data-note-id]") as HTMLElement;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    setDragState({
      id,
      task: note,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      isDragging: false,
    });
  };

  const _renderNoteItem = (note: INote) => (
    <SingleNoteCard
      key={note.id}
      note={note}
      isActive={activeNoteId === note.id}
      onSelect={onSelectNote}
      onDelete={onDeleteNote}
      onTogglePin={onTogglePin}
      onCustomDragStart={(e) => handlePointerDown(e, note.id, note)}
      isHidden={dragState?.id === note.id && dragState.isDragging}
    />
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (e: PointerEvent) => {
      const isDragging =
        dragState.isDragging ||
        Math.abs(e.clientX - dragState.startX) > 3 ||
        Math.abs(e.clientY - dragState.startY) > 3;

      if (isDragging) {
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const hoveredNoteEl = elements.find((el) =>
          el.getAttribute("data-note-id"),
        );

        if (hoveredNoteEl) {
          const targetId = hoveredNoteEl.getAttribute("data-note-id");
          if (targetId && targetId !== dragState.id) {
            // Check if they are in the same pin group
            const sourceNote = notes.find((n) => n.id === dragState.id);
            const targetNote = notes.find((n) => n.id === targetId);

            if (
              sourceNote &&
              targetNote &&
              sourceNote.pinned === targetNote.pinned
            ) {
              const rect = hoveredNoteEl.getBoundingClientRect();
              const hoverMiddleY = rect.top + rect.height / 2;

              const isDraggingDown = e.clientY > dragState.currentY;
              const isDraggingUp = e.clientY < dragState.currentY;

              if (
                (isDraggingDown && e.clientY > hoverMiddleY) ||
                (isDraggingUp && e.clientY < hoverMiddleY) ||
                (!isDraggingDown && !isDraggingUp)
              ) {
                dispatch({
                  type: "REORDER_NOTES",
                  payload: { sourceId: dragState.id, targetId },
                });
              }
            }
          }
        }
      }

      setDragState((prev) =>
        prev
          ? {
              ...prev,
              currentX: e.clientX,
              currentY: e.clientY,
              isDragging,
            }
          : null,
      );
    };

    const handlePointerUp = () => {
      setDragState(null);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragState, dispatch, notes]);

  return (
    <div className="w-full md:w-64 lg:w-80 flex flex-col h-full bg-base_color/40 backdrop-blur-xl rounded-2xl border border-border_color shadow-xl shadow-base_color/10 p-3 shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-bold text-heading_color flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary_color" />
          Notes
        </h2>
        <Button
          onClick={() => onAddNote()}
          className="p-1.5 rounded-xl bg-base_color border border-border_color shadow-sm text-primary_color hover:bg-primary_color/5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar relative">
        {notes.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="w-12 h-12 bg-base_color border border-border_color rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-disable_color" />
            </div>
            <p className="text-sm font-medium text-heading_color">
              No notes yet
            </p>
            <p className="text-xs text-disable_color mt-1">
              Click the + button to create one.
            </p>
          </div>
        ) : (
          <>
            {pinnedNotes.length > 0 && (
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 px-2 mb-2">
                  <div className="h-px flex-1 bg-border_color/50" />
                  <span className="text-[10px] font-bold text-disable_color uppercase tracking-wider">
                    Pinned
                  </span>
                  <div className="h-px flex-1 bg-border_color/50" />
                </div>
                {pinnedNotes.map(_renderNoteItem)}
              </div>
            )}

            {unpinnedNotes.length > 0 && (
              <div className="space-y-2">
                {pinnedNotes.length > 0 && unpinnedNotes.length > 0 && (
                  <div className="flex items-center gap-2 px-2 mb-2">
                    <div className="h-px flex-1 bg-border_color/50" />
                    <span className="text-[10px] font-bold text-disable_color uppercase tracking-wider">
                      Recent
                    </span>
                    <div className="h-px flex-1 bg-border_color/50" />
                  </div>
                )}
                {unpinnedNotes.map(_renderNoteItem)}
              </div>
            )}
          </>
        )}
      </div>

      {isMounted &&
        dragState?.isDragging &&
        createPortal(
          <div
            className="fixed z-[9999] pointer-events-none shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl bg-base_color border border-border_color"
            style={{
              width: dragState.width,
              height: dragState.height,
              left: dragState.currentX - dragState.offsetX,
              top: dragState.currentY - dragState.offsetY,
              maxWidth: "320px",
              minWidth: "200px",
            }}
          >
            <div className="absolute -inset-[3px] border-[3px] border-dashed border-primary_color/50 rounded-2xl pointer-events-none z-[9999]" />
            <div className="opacity-80">
              <SingleNoteCard
                note={dragState.task}
                isActive={false}
                onSelect={() => {}}
                onDelete={() => {}}
                onTogglePin={() => {}}
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default NoteList;
