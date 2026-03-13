import { Plus } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useAppContext } from "@/context/app-context";
import { ITaskListProps } from "@/types";
import { Button } from "./atoms";
import { TaskCard } from "./task-card";

export const TaskList: React.FC<ITaskListProps> = ({
  onOpenAddModal,
  onEditTask,
  onDeleteTask,
  onMarkDoneTask,
  onQuickDoneTask,
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
        <Button
          onClick={onOpenAddModal}
          className="w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-white font-semibold py-2.5 px-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 focus:ring-4 focus:ring-brand-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </Button>
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
            onQuickDone={onQuickDoneTask}
          />
        ))}

        {todoTasks.length === 0 && (
          <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-12 border border-white/60 shadow-xl shadow-slate-200/40 text-center animate-scale-in relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-110 duration-700"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-500/5 rounded-tr-[80px] pointer-events-none transition-transform group-hover:scale-110 duration-700"></div>

            <div className="relative mb-8 flex justify-center">
              <div className="w-60 h-60 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10 border-4 border-white transition-transform duration-500 relative opacity-40">
                <Image
                  src="https://media.tenor.com/xH1eX6g_KrMAAAAj/goma-peach.gif"
                  alt="Success"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </div>

            <h3 className="text-2xl font-display font-black text-slate-800 mb-2 tracking-tight">
              You&apos;re All Caught Up!
            </h3>
            <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">
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

      <div className="pt-8 mb-6 mt-8 border-t border-slate-200">
        <h2 className="text-xl font-display font-bold text-slate-800 tracking-tight flex items-center gap-2 mb-2">
          Completed
          <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-bold">
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
            />
          ))
        ) : (
          <div className="bg-slate-50/40 rounded-4xl p-10 border border-slate-200/60 text-center animate-fade-in group">
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
            <h3 className="text-lg font-display font-bold text-slate-600 mb-2">
              The Journey Begins Here
            </h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              Complete your first task to see your achievements blooming here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
