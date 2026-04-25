import { INoteItemProps } from "@/types/notebook.types";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import React from "react";

const SingleNoteItem: React.FC<INoteItemProps> = ({
  note,
  isActive,
  onSelect,
  onDelete,
}) => {
  // Extract a small snippet from content for the preview
  const rawText = note.content.trim() || "Empty note...";
  const previewText = rawText
    .replace(/^[#*>-]+\s*/gm, "")
    .replace(/[*_~`]/g, "");

  return (
    <div
      onClick={() => onSelect(note.id)}
      className={cn(
        "p-4 rounded-2xl cursor-pointer transition-all border group relative",
        {
          "bg-base_color border-primary_color shadow-sm shadow-primary_color/5": isActive,
          "bg-base_color/40 border-transparent hover:bg-base_color/80 hover:border-border_color":
            !isActive,
        },
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4
          className={cn("font-bold text-sm truncate pr-10", {
            "text-primary_color": isActive,
            "text-heading_color": !isActive,
          })}
        >
          {previewText.split("\n")[0].substring(0, 40) || "New Note"}
        </h4>
      </div>

      <p className="text-xs text-heading_color_secondary line-clamp-2 leading-relaxed mb-0.5">
        {previewText}
      </p>

      <div className="flex items-center justify-end">
        <span className="text-[10px] font-medium text-disable_color whitespace-nowrap">
          {format(new Date(note.updatedAt), "d MMMM yyyy")}
        </span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(note.id);
        }}
        className={cn(
          "absolute top-3 right-3 p-1.5 rounded-lg bg-rose-50 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-100 cursor-pointer z-10",
          { "opacity-100": isActive },
        )}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default SingleNoteItem;
