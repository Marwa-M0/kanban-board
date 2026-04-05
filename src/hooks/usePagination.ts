import { useState, useMemo } from "react";
import { Task, PAGE_SIZE } from "@/types";

export function usePagination(tasks: Task[]) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(tasks.length / PAGE_SIZE);
  const paginatedTasks = useMemo(
    () => tasks.slice(0, page * PAGE_SIZE),
    [tasks, page]
  );

  const hasMore = page * PAGE_SIZE < tasks.length;

  const loadMore = () => setPage((prev) => prev + 1);
  const reset = () => setPage(1);

  return { paginatedTasks, hasMore, loadMore, reset, totalPages, page };
}
