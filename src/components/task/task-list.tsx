import { useAppContext } from "@/context/app-context";
import { ITask } from "@/models";
import { IDragState, ITaskListProps } from "@/types";
import { Plus } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../atoms";
import TaskCard from "./task-card";

const TaskList: React.FC<ITaskListProps> = ({
  onOpenAddModal,
  onEditTask,
  onDeleteTask,
  onMarkDoneTask,
  onQuickDoneTask,
  onUndoTask,
}) => {
  const { state, dispatch } = useAppContext();
  const [dragState, setDragState] = useState<IDragState<ITask> | null>(null);

  const todoTasks = state.tasks.filter((t) => t.status === "TODO");
  const doneTasks = state.tasks.filter((t) => t.status === "DONE");

  const handlePointerDown = (
    e: React.PointerEvent,
    id: string,
    task: ITask,
  ) => {
    if (e.button !== 0) return; // Only allow left clicks

    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const card = target.closest(".group") as HTMLElement;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    setDragState({
      id,
      task,
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

  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (e: PointerEvent) => {
      const isDragging =
        dragState.isDragging ||
        Math.abs(e.clientX - dragState.startX) > 3 ||
        Math.abs(e.clientY - dragState.startY) > 3;

      if (isDragging) {
        const elements = document.elementsFromPoint(e.clientX, e.clientY);

        // Dynamic reordering over tasks
        const hoveredTaskEl = elements.find((el) =>
          el.getAttribute("data-task-id"),
        );
        if (hoveredTaskEl) {
          const targetId = hoveredTaskEl.getAttribute("data-task-id");
          const targetStatus = hoveredTaskEl.getAttribute("data-task-status");

          if (
            targetId &&
            targetId !== dragState.id &&
            targetStatus === dragState.task.status
          ) {
            const rect = hoveredTaskEl.getBoundingClientRect();
            const hoverMiddleY = rect.top + rect.height / 2;

            const isDraggingDown = e.clientY > dragState.currentY;
            const isDraggingUp = e.clientY < dragState.currentY;

            if (
              (isDraggingDown && e.clientY > hoverMiddleY) ||
              (isDraggingUp && e.clientY < hoverMiddleY) ||
              (!isDraggingDown && !isDraggingUp)
            ) {
              dispatch({
                type: "REORDER_TASKS",
                payload: { sourceId: dragState.id, targetId },
              });
            }
          }
        } else {
          // Dynamic reordering over top/bottom empty zones
          const dropZoneTop = elements.find(
            (el) => el.getAttribute("data-dropzone") === "top",
          );
          const dropZoneBottom = elements.find(
            (el) => el.getAttribute("data-dropzone") === "bottom",
          );

          if (dropZoneTop && todoTasks.length > 0) {
            const topId = todoTasks[0].id;
            if (dragState.id !== topId && dragState.task.status === "TODO") {
              dispatch({
                type: "REORDER_TASKS",
                payload: { sourceId: dragState.id, targetId: topId },
              });
            }
          } else if (dropZoneBottom && todoTasks.length > 0) {
            const bottomId = todoTasks[todoTasks.length - 1].id;
            if (dragState.id !== bottomId && dragState.task.status === "TODO") {
              dispatch({
                type: "REORDER_TASKS",
                payload: { sourceId: dragState.id, targetId: bottomId },
              });
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
  }, [dragState, dispatch, todoTasks]);

  return (
    <div className="space-y-8 animate-fade-in animation-delay-300 opacity-0 fill-mode-forwards">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-display font-black text-heading_color tracking-tight flex items-center gap-2">
            To-Do Today
            <span className="bg-heading_color text-base_color text-xs px-2.5 py-1 rounded-full font-bold">
              {todoTasks.length}
            </span>
          </h2>
          <p className="text-heading_color_secondary text-sm font-medium mt-1">
            Focus on one task at a time.
          </p>
        </div>
        <Button
          onClick={onOpenAddModal}
          className="w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-white font-semibold py-2.5 px-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 focus:ring-4 focus:ring-brand-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </Button>
      </div>

      <div className="space-y-3 relative z-10">
        {/* Top drop zone */}
        <div
          data-dropzone="top"
          className="h-8 -mt-8 opacity-0 hover:opacity-100 transition-opacity"
        />

        {todoTasks.map((t, index) => (
          <TaskCard
            key={t.id}
            task={t}
            index={index}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onMarkDone={onMarkDoneTask}
            onQuickDone={onQuickDoneTask}
            onCustomDragStart={(e) => handlePointerDown(e, t.id, t)}
            isHidden={dragState?.id === t.id && dragState.isDragging}
          />
        ))}

        {/* Bottom drop zone */}
        <div
          data-dropzone="bottom"
          className="h-8 opacity-0 hover:opacity-100 transition-opacity"
        />

        {todoTasks.length === 0 && (
          <div className="bg-base_color/40 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-12 border border-border_color/60 shadow-xl shadow-base_color/10 text-center animate-scale-in relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-110 duration-700"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-500/5 rounded-tr-[80px] pointer-events-none transition-transform group-hover:scale-110 duration-700"></div>

            <div className="relative mb-8 flex justify-center">
              <div className="w-60 h-60 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10 border-4 border-border_color transition-transform duration-500 relative opacity-40">
                <Image
                  src="https://media.tenor.com/xH1eX6g_KrMAAAAj/goma-peach.gif"
                  alt="Success"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </div>

            <h3 className="text-2xl font-display font-black text-heading_color mb-2 tracking-tight">
              You&apos;re All Caught Up!
            </h3>
            <p className="text-heading_color_secondary text-sm mb-8 max-w-xs mx-auto">
              Every task is finished. Enjoy your peaceful moment of
              accomplishment.
            </p>
            <Button
              onClick={onOpenAddModal}
              className="border border-brand-600 hover:bg-brand-50 text-brand-600 font-semibold py-3.5 px-8 rounded-2xl transition-all active:scale-95 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Plan Next Task</span>
            </Button>
          </div>
        )}
      </div>

      <div className="pt-8 mb-6 mt-8 border-t border-border_color">
        <h2 className="text-xl font-display font-bold text-heading_color tracking-tight flex items-center gap-2 mb-2">
          Completed
          <span className="bg-success_bg_color text-success_color text-xs px-2.5 py-1 rounded-full font-bold">
            {doneTasks.length}
          </span>
        </h2>
      </div>

      <div className="space-y-3">
        {doneTasks.length > 0 ? (
          doneTasks.map((t, index) => (
            <TaskCard
              key={t.id}
              task={t}
              index={index}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onUndo={onUndoTask}
              onCustomDragStart={(e) => handlePointerDown(e, t.id, t)}
              isHidden={dragState?.id === t.id && dragState.isDragging}
            />
          ))
        ) : (
          <div className="bg-base_color/40 rounded-4xl p-10 border border-border_color/60 text-center animate-fade-in group">
            <div className="mb-6 flex justify-center">
              <div className="w-48 h-32 sm:w-56 sm:h-40 rounded-2xl overflow-hidden grayscale-[0.2] opacity-80 transition-all duration-500 relative">
                <Image
                  src="https://media.tenor.com/0cNM_9li440AAAAj/dudu-giving-flowers-bubu-flowers.gif"
                  alt="Ready to start"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </div>
            <h3 className="text-lg font-display font-bold text-heading_color_secondary mb-2">
              The Journey Begins Here
            </h3>
            <p className="text-disable_color text-sm max-w-xs mx-auto">
              Complete your first task to see your achievements blooming here.
            </p>
          </div>
        )}
      </div>

      {dragState?.isDragging && (
        <div
          className="fixed z-100 pointer-events-none shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl"
          style={{
            width: dragState.width,
            height: dragState.height,
            left: dragState.currentX - dragState.offsetX,
            top: dragState.currentY - dragState.offsetY,
          }}
        >
          <div className="absolute -inset-[3px] border-[3px] border-dashed border-brand-500/50 rounded-2xl pointer-events-none z-20" />
          <TaskCard
            task={dragState.task}
            index={0}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export default TaskList;
