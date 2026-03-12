import { ITask } from "@/models";

export interface ITaskCardProps {
  task: ITask;
  index: number;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onMarkDone?: (taskId: string) => void;
  onQuickDone?: (taskId: string) => void;
  onUndo?: (taskId: string) => void;
}

export interface ITaskListProps {
  onOpenAddModal: () => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onMarkDoneTask: (taskId: string) => void;
  onQuickDoneTask: (taskId: string) => void;
  onUndoTask: (taskId: string) => void;
}

export interface IAddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<ITask>) => void;
  initialTask?: ITask | null;
}

export interface ITimeInputModalProps {
  task: ITask | null;
  onClose: () => void;
  onSubmit: (taskId: string, timeSpent: number) => void;
}

export interface IProgressRingProps {
  percentage: number;
  className?: string;
}

export interface ITaskTimeBadgeProps {
  targetStr: string;
}

export interface TogglerProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
}
