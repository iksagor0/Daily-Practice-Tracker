import { Button, Linkify } from "@/components/atoms";
import { ITaskCardProps } from "@/types";
import { cn } from "@/utils/cn";
import * as LucideIcons from "lucide-react";
import React from "react";
import TaskTimeBadge from "./task-time-badge";

/**
 * ActiveTaskCard component for rendering tasks in progress.
 */
const ActiveTaskCard: React.FC<ITaskCardProps> = ({
  task,
  index,
  onEdit,
  onDelete,
  onMarkDone,
  onQuickDone,
  onCustomDragStart,
  isHidden,
}) => {
  const IconComponent =
    (LucideIcons as unknown as Record<string, React.ElementType>)[
      task.icon
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")
    ] || LucideIcons.Target;

  const TrashIcon = LucideIcons.Trash2;
  const EditIcon = LucideIcons.Edit2;
  const ZapIcon = LucideIcons.Zap;
  const CheckIcon = LucideIcons.Check;
  const RepeatIcon = LucideIcons.Repeat;

  // Animation delay based on index for staggered entrance
  const delay = `${index * 0.05}s`;

  return (
    <div
      data-task-id={task.id}
      data-task-status="TODO"
      className={cn(
        "bg-base_color/80 backdrop-blur-sm border border-border_color transition-all duration-300 ease-in-out hover:border-brand-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 group animate-slide-up fill-mode-forwards relative",
        isHidden ? "opacity-0 invisible" : "opacity-100",
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
      <div
        className={cn(
          "shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm relative",
          task.colorClass,
        )}
      >
        <IconComponent className="w-6 h-6" />
        {task.repeatDaily && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
            <RepeatIcon className="w-2.5 h-2.5 text-brand-600" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 w-full">
        {/* name and time */}
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-start gap-2 mb-0.5">
          <h3
            title={task.name}
            className="font-bold text-heading_color text-base leading-tight group-hover:text-brand-700 transition-colors md:truncate"
          >
            {task.name}
          </h3>
          <div className="shrink-0 sm:ml-2">
            <TaskTimeBadge targetStr={task.targetStr} />
          </div>
        </div>

        {/* description */}
        <p className="text-heading_color_secondary text-sm leading-relaxed line-clamp-2 group-hover:text-heading_color transition-colors">
          <Linkify text={task.desc} />
        </p>
      </div>

      {/* buttons */}
      <div className="shrink-0 w-full sm:w-auto mt-3 sm:mt-0 flex justify-between sm:justify-end gap-2 sm:ml-1 items-center">
        <div className="shrink-0 flex gap-2">
          <Button
            onClick={() => onDelete(task.id)}
            className="flex w-8 h-8 sm:w-6 sm:h-6 shrink-0 rounded-lg bg-base_color/50 border border-border_color text-disable_color hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50 shadow-sm focus:ring-2 focus:ring-rose-100"
            title="Delete Task"
          >
            <TrashIcon className="w-4 h-4 sm:w-2.5 sm:h-2.5" />
          </Button>

          <Button
            onClick={() => onEdit(task.id)}
            className="flex w-8 h-8 sm:w-6 sm:h-6 shrink-0 rounded-lg bg-base_color/50 border border-border_color text-disable_color hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 shadow-sm focus:ring-2 focus:ring-indigo-100"
            title="Edit Task"
          >
            <EditIcon className="w-4 h-4 sm:w-2.5 sm:h-2.5" />
          </Button>

          <Button
            onClick={() => onQuickDone && onQuickDone(task.id)}
            title="Move to Completed (0m)"
            className="w-8 h-8 sm:w-6 sm:h-6 flex-1 sm:flex-none flex py-2.5 sm:py-0 shrink-0 rounded-lg bg-base_color/50 border border-border_color text-disable_color hover:border-amber-400 hover:text-amber-500 hover:bg-amber-50 shadow-sm gap-1 sm:gap-0 whitespace-nowrap"
          >
            <ZapIcon className="w-4 h-4" />
          </Button>
        </div>

        <Button
          onClick={() => onMarkDone && onMarkDone(task.id)}
          className="flex-1 sm:flex-none flex sm:w-10 sm:h-10 px-2 py-2.5 sm:py-0 shrink-0 rounded-xl sm:rounded-full bg-base_color/50 border border-border_color text-disable_color hover:border-emerald-400 hover:text-emerald-500 hover:bg-emerald-50 shadow-sm focus:ring-4 focus:ring-emerald-100 font-semibold sm:font-normal gap-1 sm:gap-0  whitespace-nowrap"
          title="Mark Done"
        >
          <CheckIcon className="w-5 h-5" />{" "}
          <span className="sm:hidden text-sm">Mark Done</span>
        </Button>
      </div>
    </div>
  );
};

export default ActiveTaskCard;
