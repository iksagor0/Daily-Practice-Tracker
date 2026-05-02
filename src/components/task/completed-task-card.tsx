import { Button, Linkify } from "@/components/atoms";
import { ITaskCardProps } from "@/types";
import { cn } from "@/utils/cn";
import * as LucideIcons from "lucide-react";
import React from "react";

/**
 * CompletedTaskCard component for rendering finished tasks.
 */
const CompletedTaskCard: React.FC<ITaskCardProps> = ({
  task,
  index,
  onEdit,
  onDelete,
  onUndo,
  onCustomDragStart,
  isHidden,
}) => {
  const CheckIcon = LucideIcons.Check;
  const TimerIcon = LucideIcons.Timer;
  const UndoIcon = LucideIcons.RotateCcw;
  const RepeatIcon = LucideIcons.Repeat;
  const EditIcon = LucideIcons.Edit2;
  const TrashIcon = LucideIcons.Trash2;

  // Animation delay based on index for staggered entrance
  const delay = `${index * 0.05}s`;

  return (
    <div
      data-task-id={task.id}
      data-task-status="DONE"
      className={cn(
        "bg-base_color/40 backdrop-blur-sm border border-border_color shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-300 group relative animate-slide-up fill-mode-forwards",
        isHidden ? "opacity-0 invisible" : "opacity-80 hover:opacity-100",
      )}
      style={{ animationDelay: delay }}
    >
      <div
        onPointerDown={(e) => onCustomDragStart?.(e, task.id)}
        className="absolute top-0 left-0 right-0 h-4 drag-handle cursor-move z-20"
      />
      <div
        onPointerDown={(e) => onCustomDragStart?.(e, task.id)}
        className="absolute bottom-0 left-0 right-0 h-4 drag-handle cursor-move z-20"
      />

      {/* icon */}
      <div className="shrink-0 w-12 h-12 rounded-xl bg-base_color/50 text-disable_color flex items-center justify-center relative">
        <CheckIcon className="w-6 h-6" />
        {task.repeatDaily && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-base_color border border-border_color flex items-center justify-center shadow-xs">
            <RepeatIcon className="w-2.5 h-2.5 text-disable_color" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 w-full">
        {/* name and time */}
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-start gap-2 mb-0.5">
          <h3 className="font-bold text-heading_color_secondary text-base line-through leading-tight truncate w-full sm:w-auto opacity-70">
            {task.name}
          </h3>
          <div className="text-success_color font-bold text-xs flex items-center gap-1.5 bg-success_bg_color px-2.5 py-1 rounded-full border border-success_border_color shrink-0 sm:ml-2">
            <TimerIcon className="w-3.5 h-3.5" /> {task.actualTime} min
          </div>
        </div>

        {/* description */}
        <p className="text-disable_color text-sm leading-relaxed line-clamp-2 opacity-80">
          <Linkify text={task.desc} />
        </p>
      </div>

      {/* buttons */}
      <div className="shrink-0 w-full sm:w-auto mt-3 sm:mt-0 flex justify-between sm:justify-end gap-2 sm:ml-1 items-center">
        <div className="shrink-0 flex gap-2">
          <Button
            onClick={() => onEdit(task.id)}
            className="flex w-8 h-8 sm:w-6 sm:h-6 shrink-0 rounded-lg bg-base_color/50 border border-border_color text-disable_color hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 shadow-sm focus:ring-2 focus:ring-indigo-100"
            title="Edit Task"
          >
            <EditIcon className="w-4 h-4 sm:w-2.5 sm:h-2.5" />
          </Button>
          <Button
            onClick={() => onDelete(task.id)}
            className="flex w-8 h-8 sm:w-6 sm:h-6 shrink-0 rounded-lg bg-base_color/50 border border-border_color text-disable_color hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50 shadow-sm focus:ring-2 focus:ring-rose-100"
            title="Delete Task"
          >
            <TrashIcon className="w-4 h-4 sm:w-2.5 sm:h-2.5" />
          </Button>
        </div>
        <Button
          onClick={() => onUndo && onUndo(task.id)}
          title="Undo"
          className="flex-1 sm:flex-none flex sm:w-10 sm:h-10 py-2.5 sm:py-0 shrink-0 gap-2 sm:gap-0 text-disable_color font-semibold sm:font-normal hover:text-primary_color rounded-xl sm:rounded-full hover:bg-base_color/50 border border-transparent hover:border-border_color shadow-sm"
        >
          <UndoIcon className="w-4 h-4" />{" "}
          <span className="sm:hidden text-sm">Undo</span>
        </Button>
      </div>
    </div>
  );
};

export default CompletedTaskCard;
