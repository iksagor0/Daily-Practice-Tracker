import React from "react";
import { Plus } from "lucide-react";
import { useAppContext } from "@/context/app-context";
import { TaskCard } from "./task-card";

interface ITaskListProps {
  onOpenAddModal: () => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onMarkDoneTask: (taskId: string) => void;
  onUndoTask: (taskId: string) => void;
}

export const TaskList: React.FC<ITaskListProps> = ({
  onOpenAddModal,
  onEditTask,
  onDeleteTask,
  onMarkDoneTask,
  onUndoTask,
}) => {
  const { state } = useAppContext();

  const todoTasks = state.tasks.filter((t) => t.status === "TODO");
  const doneTasks = state.tasks
    .filter((t) => t.status === "DONE")
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

  return (
    <div className="space-y-8 animate-fade-in animation-delay-300 opacity-0 fill-mode-forwards">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-display font-black text-slate-800 tracking-tight flex items-center gap-2">
            To-Do Today
            <span className="bg-slate-800 text-white text-xs px-2.5 py-1 rounded-full font-bold">
              {todoTasks.length}
            </span>
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Focus on one task at a time.
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-white font-semibold py-2.5 px-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 focus:ring-4 focus:ring-brand-200 outline-none cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>

      <div className="space-y-3 relative z-10">
        {todoTasks.map((t, index) => (
          <TaskCard
            key={t.id}
            task={t}
            index={index}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onMarkDone={onMarkDoneTask}
          />
        ))}

        {todoTasks.length === 0 && (
          <div className="text-center py-12 px-4 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
              <span className="text-2xl pt-1">✨</span>
            </div>
            <h3 className="text-slate-700 font-bold mb-1">
              You're all caught up!
            </h3>
            <p className="text-slate-500 text-sm mb-4">
              You've completed everything for today.
            </p>
            <button
              onClick={onOpenAddModal}
              className="text-brand-600 hover:text-brand-700 font-bold text-sm bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl transition-colors"
            >
              + Add a new task
            </button>
          </div>
        )}
      </div>

      <div className="pt-8 mb-6 mt-8 border-t border-slate-200">
        <h2 className="text-xl font-display font-bold text-slate-800 tracking-tight flex items-center gap-2 mb-2">
          Completed
          <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-bold">
            {doneTasks.length}
          </span>
        </h2>
      </div>

      <div className="space-y-3">
        {doneTasks.map((t, index) => (
          <TaskCard
            key={t.id}
            task={t}
            index={index}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onUndo={onUndoTask}
          />
        ))}

        {doneTasks.length === 0 && (
          <div className="text-center py-8 px-4 rounded-3xl bg-slate-50/50 border border-transparent">
            <p className="text-slate-400 text-sm font-medium">
              Tasks you complete will appear here. Let's get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
