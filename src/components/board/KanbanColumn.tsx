"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Column, Task } from "@/types";
import { TaskCard } from "@/components/tasks/TaskCard";
import { useUIStore } from "@/store/uiStore";
import { usePagination } from "@/hooks/usePagination";
import { Plus, Loader2 } from "lucide-react";
import clsx from "clsx";
import { useEffect, useRef } from "react";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  isLoading: boolean;
}

export function KanbanColumn({ column, tasks, isLoading }: KanbanColumnProps) {
  const { openCreateModal } = useUIStore();
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const { paginatedTasks, hasMore, loadMore } = usePagination(tasks);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = loaderRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div className={clsx("kanban-column", { "kanban-column--over": isOver })}>
      {/* Column Header */}
      <div className="kanban-column__header">
        <div className="kanban-column__title-row">
          <span
            className="kanban-column__dot"
            style={{ backgroundColor: column.dotColor }}
          />
          <h2 className="kanban-column__title">{column.label}</h2>
          <span className="kanban-column__count">{tasks.length}</span>
        </div>
        <button
          className="kanban-column__add-btn"
          onClick={() => openCreateModal(column.id)}
          aria-label={`Add task to ${column.label}`}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Tasks List */}
      <div ref={setNodeRef} className="kanban-column__tasks">
        {isLoading ? (
          <div className="kanban-column__loading">
            <Loader2 size={20} className="spin" />
          </div>
        ) : (
          <SortableContext
            items={paginatedTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {paginatedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        )}

        {/* Infinite scroll trigger */}
        {hasMore && !isLoading && (
          <div ref={loaderRef} className="kanban-column__load-more">
            <button onClick={loadMore} className="btn btn--ghost btn--sm">
              Load more
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && tasks.length === 0 && (
          <div
            className="kanban-column__empty"
            onClick={() => openCreateModal(column.id)}
          >
            <Plus size={16} />
            <span>Add task</span>
          </div>
        )}
      </div>
    </div>
  );
}
