export type ColumnId = "backlog" | "in_progress" | "review" | "done";

export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  column: ColumnId;
  priority: Priority;
  createdAt: string;
  isMatch?: boolean;
}

export type CreateTaskInput = Omit<Task, "id" | "createdAt">;
export type UpdateTaskInput = Partial<Omit<Task, "id" | "createdAt">>;

export interface Column {
  id: ColumnId;
  label: string;
  color: string;
  dotColor: string;
}

export const COLUMNS: Column[] = [
  { id: "backlog", label: "Backlog", color: "#6b7280", dotColor: "#9ca3af" },
  { id: "in_progress", label: "In Progress", color: "#3b82f6", dotColor: "#60a5fa" },
  { id: "review", label: "In Review", color: "#f59e0b", dotColor: "#fbbf24" },
  { id: "done", label: "Done", color: "#10b981", dotColor: "#34d399" },
];

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  low: { label: "Low", color: "#6b7280" },
  medium: { label: "Medium", color: "#f59e0b" },
  high: { label: "High", color: "#ef4444" },
};

export const PAGE_SIZE = 5;
