"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { COLUMNS, ColumnId, Task } from "@/types";
import { useTasksByColumn, useUpdateTask } from "@/hooks/useTasks";
import { useUIStore } from "@/store/uiStore";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "@/components/tasks/TaskCard";


function ColumnWrapper({
  column,
  searchQuery,
}: {
  column: (typeof COLUMNS)[0];
  searchQuery: string;
}) {
  const { data: tasks = [], isLoading } = useTasksByColumn(
    column.id,
    searchQuery
  );
  return (
    <KanbanColumn column={column} tasks={tasks} isLoading={isLoading} />
  );
}

export function KanbanBoard() {
  const { searchQuery } = useUIStore();
  const updateTask = useUpdateTask();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    // We store the active task id; the overlay will render it
    const taskData = event.active.data.current as Task | undefined;
    if (taskData) setActiveTask(taskData);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;
      if (!over) return;

      const taskId = active.id as string;
      const overId = over.id as string;

      // Check if dropped over a column
      const targetColumn = COLUMNS.find((col) => col.id === overId);
      if (targetColumn) {
        updateTask.mutate({
          id: taskId,
          input: { column: targetColumn.id as ColumnId },
        });
        return;
      }

      // Dropped over another task - find that task's column
      const overTask = over.data.current as Task | undefined;
      if (overTask && activeTask && overTask.column !== activeTask.column) {
        updateTask.mutate({
          id: taskId,
          input: { column: overTask.column },
        });
      }
    },
    [updateTask, activeTask]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const taskId = active.id as string;
      const overId = over.id as string;

      // If dragged over a column id directly
      const targetColumn = COLUMNS.find((col) => col.id === overId);
      if (targetColumn && activeTask?.column !== targetColumn.id) {
        updateTask.mutate({
          id: taskId,
          input: { column: targetColumn.id as ColumnId },
        });
        return;
      }

      // Dragged over another task in a different column
      const overTask = over.data.current as Task | undefined;
      if (overTask && activeTask && overTask.column !== activeTask.column) {
        updateTask.mutate({
          id: taskId,
          input: { column: overTask.column },
        });
      }
    },
    [updateTask, activeTask]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="kanban-board">
        {COLUMNS.map((column) => (
          <ColumnWrapper
            key={column.id}
            column={column}
            searchQuery={searchQuery}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
