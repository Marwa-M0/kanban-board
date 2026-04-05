import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Task, ColumnId } from "@/types";

interface TaskModalState {
  isOpen: boolean;
  mode: "create" | "edit";
  defaultColumn?: ColumnId;
  task?: Task;
}

interface UIState {
  searchQuery: string;
  taskModal: TaskModalState;
  
  deleteConfirmation: {
    isOpen: boolean;
    taskId?: string;
    taskTitle?: string;
  };

  // Actions
  setSearchQuery: (query: string) => void;
  openCreateModal: (defaultColumn?: ColumnId) => void;
  openEditModal: (task: Task) => void;
  closeModal: () => void;
  
  openDeleteConfirmation: (taskId: string, taskTitle: string) => void;
  closeDeleteConfirmation: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      searchQuery: "",
      taskModal: {
        isOpen: false,
        mode: "create",
      },

      deleteConfirmation: {
        isOpen: false,
      },

      setSearchQuery: (query) => set({ searchQuery: query }),

      openCreateModal: (defaultColumn) =>
        set({
          taskModal: {
            isOpen: true,
            mode: "create",
            defaultColumn,
            task: undefined,
          },
        }),

      openEditModal: (task) =>
        set({
          taskModal: {
            isOpen: true,
            mode: "edit",
            task,
            defaultColumn: task.column,
          },
        }),

      closeModal: () =>
        set((state) => ({
          taskModal: { ...state.taskModal, isOpen: false },
        })),

      openDeleteConfirmation: (taskId, taskTitle) =>
        set({
          deleteConfirmation: {
            isOpen: true,
            taskId,
            taskTitle,
          },
        }),

      closeDeleteConfirmation: () =>
        set((state) => ({
          deleteConfirmation: { ...state.deleteConfirmation, isOpen: false },
        })),
    }),
    { name: "ui-store" }
  )
);
