import React, { useState, useEffect, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { X } from "lucide-react";
import { AVAILABLE_ICONS } from "@/constants";
import { ITask } from "@/models";
import { IAddTaskModalProps } from "@/types";
import { Modal, Button } from "./atoms";
import { cn } from "@/utils/cn";

export const AddTaskModal: React.FC<IAddTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
}) => {
  const [name, setName] = useState("");
  const [targetTime, setTargetTime] = useState<string>("");
  const [desc, setDesc] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(AVAILABLE_ICONS[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    /* eslint-disable */
    if (isOpen) {
      if (initialTask) {
        setName(initialTask.name);
        setTargetTime(
          initialTask.targetTime ? String(initialTask.targetTime) : "",
        );
        setDesc(initialTask.desc);
        setSelectedIcon(initialTask.icon);
      } else {
        setName("");
        setTargetTime("");
        setDesc("");
        setSelectedIcon(AVAILABLE_ICONS[0]);
      }
      setIsExpanded(false);
    }
    /* eslint-enable */
  }, [isOpen, initialTask]);

  const displayIcons = useMemo(() => {
    return isExpanded ? AVAILABLE_ICONS : AVAILABLE_ICONS.slice(0, 22);
  }, [isExpanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedTime = targetTime ? parseInt(targetTime, 10) : null;
    const targetStr = parsedTime ? `${parsedTime} min` : "Unlimited";

    // Auto assign a random color class if it's a new custom task
    // (Existing task gets its old color in typical logic handled by parent, we just pass what changed)
    const taskData: Partial<ITask> = {
      name: name.trim(),
      targetTime: parsedTime,
      targetStr: targetStr,
      desc: desc.trim() || "No description provided.",
      icon: selectedIcon,
    };

    // For new task ONLY, parent needs to know color class, but AppReducer can do it, or we do it here.
    // We will pass it, and parent or reducer merges it.

    onSubmit(taskData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      overlayStyle={{
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
    >
      <div className="bg-white rounded-4xl shadow-2xl w-[90%] max-w-md border border-white relative overflow-hidden flex flex-col h-[800px] max-h-[90vh] animate-scale-in">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-[100px] -z-10"></div>

        <div className="shrink-0 flex items-center justify-between p-6 sm:p-8 pb-4 sm:pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-display font-black text-slate-800 tracking-tight leading-tight">
              {initialTask ? "Edit Task" : "New Task"}
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Organize your priorities.
            </p>
          </div>
          <Button
            type="button"
            onClick={onClose}
            className="w-10 h-10 -mt-2 -mr-2 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:ring-4 focus:ring-slate-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
          <form id="addTaskForm" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-extrabold tracking-tight text-slate-700 mb-2">
                Task Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Read an article"
                required
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 hover:border-brand-300 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-extrabold tracking-tight text-slate-700 mb-2">
                Target Time (Optional)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={targetTime}
                  onChange={(e) => setTargetTime(e.target.value)}
                  placeholder="e.g. 30"
                  min="1"
                  className="w-full pl-4 pr-16 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 hover:border-brand-300 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800 appearance-none"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 font-bold text-sm bg-linear-to-l from-slate-50 via-slate-50 rounded-r-2xl pl-2">
                  min
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-extrabold tracking-tight text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={2}
                placeholder="Briefly describe your task..."
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 hover:border-brand-300 outline-none transition-all resize-none placeholder:text-slate-400 font-medium text-slate-800"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-extrabold tracking-tight text-slate-700 mb-3">
                Choose an Icon
              </label>
              <div className="flex flex-wrap gap-2.5">
                {displayIcons.map((iconName) => {
                  const pascalCaseIcon = iconName
                    .split("-")
                    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                    .join("");
                  const Icon =
                    (
                      LucideIcons as unknown as Record<
                        string,
                        React.ElementType
                      >
                    )[pascalCaseIcon] || LucideIcons.Target;
                  const isSelected = selectedIcon === iconName;
                  return (
                    <Button
                      key={iconName}
                      type="button"
                      onClick={() => setSelectedIcon(iconName)}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center border-2 shrink-0",
                        isSelected
                          ? "border-brand-500 bg-brand-50 text-brand-600 shadow-sm"
                          : "border-slate-200 bg-white text-slate-400 hover:border-brand-300 hover:text-brand-500 hover:bg-slate-50 shadow-sm",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </Button>
                  );
                })}

                {!isExpanded && AVAILABLE_ICONS.length > 22 && (
                  <Button
                    onClick={() => setIsExpanded(true)}
                    type="button"
                    className="w-auto px-3 h-10 rounded-xl flex items-center justify-center border-2 border-slate-200 bg-slate-50 text-slate-500 hover:text-brand-600 hover:border-brand-300 shadow-sm font-semibold text-xs shrink-0"
                  >
                    +{AVAILABLE_ICONS.length - 22} More
                  </Button>
                )}
                {isExpanded && (
                  <Button
                    onClick={() => setIsExpanded(false)}
                    type="button"
                    className="w-auto px-3 h-10 rounded-xl flex items-center justify-center border-2 border-slate-200 bg-slate-50 text-slate-500 hover:text-brand-600 hover:border-brand-300 shadow-sm font-semibold text-xs shrink-0"
                  >
                    Show Less
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="shrink-0 p-6 sm:px-8 border-t border-slate-100 bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] rounded-b-4xl">
          <Button
            type="submit"
            form="addTaskForm"
            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-sm hover:shadow-brand-500/25 text-[15px] focus:ring-4 focus:ring-brand-200"
          >
            {initialTask ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
