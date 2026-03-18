import { ActiveTaskCard } from "@/components/active-task-card";
import { CompletedTaskCard } from "@/components/completed-task-card";
import { ITaskCardProps } from "@/types";
import React from "react";

/**
 * TaskCard wrapper component that delegates to ActiveTaskCard or CompletedTaskCard.
 */
export const TaskCard: React.FC<ITaskCardProps> = (props) => {
  const isDone = props.task.status === "DONE";

  if (isDone) {
    return <CompletedTaskCard {...props} />;
  }

  return <ActiveTaskCard {...props} />;
};
