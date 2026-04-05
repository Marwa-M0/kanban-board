"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, PRIORITY_CONFIG } from "@/types";
import { useUIStore } from "@/store/uiStore";
import { useDeleteTask } from "@/hooks/useTasks";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const { openEditModal, openDeleteConfirmation } = useUIStore();
  const deleteTask = useDeleteTask();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ 
    id: task.id,
    data: task
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = PRIORITY_CONFIG[task.priority] ?? { label: task.priority, color: "#6b7280" };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDeleteConfirmation(task.id, task.title);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEditModal(task);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx("task-card", {
        "task-card--dragging": isSortableDragging || isDragging,
        "task-card--dimmed": task.isMatch === false,
      })}
    >
      {/* Drag Handle */}
      <button
        className="task-card__drag-handle"
        {...attributes}
        {...listeners}
        aria-label="Drag task"
      >
        <GripVertical size={14} />
      </button>

      {/* Content */}
      <div className="task-card__body">
        <h3 className="task-card__title">{task.title}</h3>
        {task.description && (
          <p className="task-card__description">{task.description}</p>
        )}
      </div>

      {/* Footer */}
      <div className="task-card__footer">
        <span
          className="task-card__priority"
          style={{ color: priority.color, borderColor: `${priority.color}40`, backgroundColor: `${priority.color}10` }}
        >
          {priority.label}
        </span>

        <div className="task-card__actions">
          <button
            className="task-card__action-btn task-card__action-btn--edit"
            onClick={handleEdit}
            title="Edit task"
          >
            <Pencil size={13} />
          </button>
          <button
            className="task-card__action-btn task-card__action-btn--delete"
            onClick={handleDelete}
            title="Delete task"
            disabled={deleteTask.isPending}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
