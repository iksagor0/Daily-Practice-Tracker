import { ITaskCardProps } from "@/types";
import React from "react";
import ActiveTaskCard from "./active-task-card";
import CompletedTaskCard from "./completed-task-card";

/**
 * TaskCard wrapper component that delegates to ActiveTaskCard or CompletedTaskCard.
 */
const TaskCard: React.FC<ITaskCardProps> = (props) => {
  const isDone = props.task.status === "DONE";

  if (isDone) {
    return <CompletedTaskCard {...props} />;
  }

  return <ActiveTaskCard {...props} />;
};

export default TaskCard;
