"use client";

import React, { useState } from "react";
import { Header } from "@/components/header";
import { TaskList } from "@/components/task-list";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { Footer } from "@/components/footer";
import { AuthOverlay } from "@/components/auth-overlay";
import { AddTaskModal } from "@/components/add-task-modal";
import { TimeInputModal } from "@/components/time-input-modal";
import { useAppContext } from "@/context/app-context";
import { ITask } from "@/models";
import { Notebook } from "@/components/notebook";

export type TActiveTab = "TRACKER" | "NOTEBOOK";

export default function Home() {
  const { state, dispatch } = useAppContext();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [activeTaskForTime, setActiveTaskForTime] = useState<ITask | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<TActiveTab>("TRACKER");

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsAddModalOpen(true);
  };

  const handleEditTask = (taskId: string) => {
    const task = state.tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setIsAddModalOpen(true);
    }
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmitTask = (taskData: Partial<ITask>) => {
    if (editingTask) {
      dispatch({
        type: "EDIT_TASK",
        payload: {
          id: editingTask.id,
          name: taskData.name!,
          targetTime: taskData.targetTime || null,
          targetStr: taskData.targetStr!,
          desc: taskData.desc!,
          icon: taskData.icon!,
          repeatDaily: taskData.repeatDaily!,
        },
      });
    } else {
      const colors = [
        "bg-indigo-50 text-indigo-600",
        "bg-emerald-50 text-emerald-600",
        "bg-sky-50 text-sky-600",
        "bg-blue-50 text-blue-600",
        "bg-purple-50 text-purple-600",
        "bg-fuchsia-50 text-fuchsia-600",
        "bg-red-50 text-red-600",
        "bg-orange-50 text-orange-600",
      ];
      const colorClass = colors[Math.floor(Math.random() * colors.length)];

      const newTask: ITask = {
        id: "task_" + Date.now(),
        name: taskData.name!,
        targetTime: taskData.targetTime || null,
        targetStr: taskData.targetStr!,
        desc: taskData.desc!,
        icon: taskData.icon!,
        colorClass,
        repeatDaily: taskData.repeatDaily!,
        status: "TODO",
        actualTime: 0,
      };

      dispatch({ type: "ADD_TASK", payload: newTask });
    }
    handleCloseAddModal();
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to permanently delete this task?")) {
      dispatch({ type: "DELETE_TASK", payload: taskId });
    }
  };

  const handleMarkDone = (taskId: string) => {
    const task = state.tasks.find((t) => t.id === taskId);
    if (task) {
      setActiveTaskForTime(task);
    }
  };

  const handleQuickDone = (taskId: string) => {
    dispatch({ type: "COMPLETE_TASK", payload: { id: taskId, timeSpent: 0 } });
  };

  const handleSubmitTime = (taskId: string, timeSpent: number) => {
    dispatch({ type: "COMPLETE_TASK", payload: { id: taskId, timeSpent } });
    setActiveTaskForTime(null);
  };

  const handleUndoTask = (taskId: string) => {
    dispatch({ type: "UNDO_TASK", payload: taskId });
  };

  return (
    <main className="max-w-[1280px] mx-auto min-h-screen flex flex-col pt-4">
      <AuthOverlay />

      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "TRACKER" ? (
        <div className="flex-1 w-full flex flex-col lg:flex-row gap-8 lg:gap-12 px-4 lg:px-8 mt-4 relative">
          <div className="flex-1 min-w-0">
            <TaskList
              onOpenAddModal={handleOpenAddModal}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onMarkDoneTask={handleMarkDone}
              onQuickDoneTask={handleQuickDone}
              onUndoTask={handleUndoTask}
            />
          </div>

          <AnalyticsDashboard />
        </div>
      ) : (
        <div className="flex-1 w-full flex flex-col px-4 lg:px-8 mt-4 relative">
          <Notebook />
        </div>
      )}

      <Footer />

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleSubmitTask}
        initialTask={editingTask}
      />

      <TimeInputModal
        task={activeTaskForTime}
        onClose={() => setActiveTaskForTime(null)}
        onSubmit={handleSubmitTime}
      />
    </main>
  );
}
