export type TTaskStatus = "TODO" | "DONE";

export interface ITask {
  readonly id: string;
  readonly name: string;
  readonly targetTime: number | null;
  readonly targetStr: string;
  readonly icon: string;
  readonly colorClass: string;
  readonly desc: string;
  readonly status?: TTaskStatus;
  readonly actualTime?: number;
  readonly completedAt?: number;
  readonly repeatDaily: boolean;
}

export interface IHistoryEntry {
  readonly date?: string; // "yyyy-MM-dd" format
  readonly timeSpent?: number;
  readonly dateKey?: string; // legacy format
  readonly totalTime?: number; // legacy format
  readonly completedTasks?: number; // legacy format
  readonly totalTasks?: number; // legacy format
}

export type THistory = readonly IHistoryEntry[];

export interface IStats {
  readonly todayTotal: number;
  readonly todayCompleted: number;
  readonly todayTime: number;
  readonly weeklyTime: number;
  readonly monthlyTime: number;
  readonly avgDaily?: number;
}

export interface IQuote {
  readonly text: string;
  readonly author: string;
}
