import { INoteCardProps } from "@/types/notebook.types";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { Pin, Trash2 } from "lucide-react";
import React from "react";

const SingleNoteCard: React.FC<INoteCardProps> = ({
  note,
  isActive,
  onSelect,
  onDelete,
  onTogglePin,
  onCustomDragStart,
  isHidden,
}) => {
  // Extract a small snippet from content for the preview
  const rawText = note.content.trim() || "Empty note...";
  const previewText = rawText
    .replace(/^[#*>-]+\s*/gm, "")
    .replace(/[*_~`]/g, "");

  if (isHidden) {
    return (
      <div
        className="w-full h-24 rounded-2xl border-2 border-dashed border-primary_color/20 bg-primary_color/5 animate-pulse"
        style={{
          backgroundColor: "var(--color-primary_color_weak)",
        }}
      />
    );
  }

  return (
    <div
      onClick={() => onSelect(note.id)}
      data-note-id={note.id}
      className={cn(
        "p-4 rounded-2xl cursor-pointer transition-all border group relative flex items-start gap-3 w-full",
        {
          "bg-base_color border-primary_color shadow-sm shadow-primary_color/5":
            isActive,
          "bg-base_color/40 border-transparent hover:bg-base_color/80 hover:border-border_color":
            !isActive,
        },
      )}
    >
      {/* Drag Handles */}
      <div
        onPointerDown={onCustomDragStart}
        className="absolute top-0 left-0 right-0 h-2 cursor-move z-20"
      />
      <div
        onPointerDown={onCustomDragStart}
        className="absolute bottom-0 left-0 right-0 h-2 cursor-move z-20"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4
            className={cn("font-bold text-sm truncate pr-6", {
              "text-primary_color": isActive,
              "text-heading_color": !isActive,
            })}
          >
            {previewText.split("\n")[0].substring(0, 40) || "New Note"}
          </h4>
        </div>

        <p className="text-xs text-heading_color_secondary line-clamp-2 leading-relaxed mb-1.5">
          {previewText}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-disable_color whitespace-nowrap">
            {format(new Date(note.updatedAt), "d MMMM yyyy")}
          </span>
          {note.pinned && (
            <Pin className="w-3 h-3 text-primary_color fill-primary_color" />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-3 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(note.id);
          }}
          className={cn("cursor-pointer hover:scale-110 transition-transform", {
            "text-primary_color border-primary_color/20": note.pinned,
            "text-heading_color_secondary": !note.pinned,
          })}
          title={note.pinned ? "Unpin note" : "Pin note"}
        >
          <Pin
            className={cn("w-3.5 h-3.5", { "fill-primary_color": note.pinned })}
          />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="text-rose-700 cursor-pointer hover:scale-110 transition-transform"
          title="Delete note"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default SingleNoteCard;
