import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { tasksApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { CreateTaskInput, UpdateTaskInput, Task, ColumnId } from "@/types";

// Queries
export function useTasks() {
  return useQuery({
    queryKey: queryKeys.tasks.lists(),
    queryFn: tasksApi.getAll,
  });
}

export function useTasksByColumn(columnId: ColumnId, searchQuery: string) {
  return useQuery({
    queryKey: queryKeys.tasks.list({ column: columnId, search: searchQuery }),
    queryFn: tasksApi.getAll,
    select: (tasks: Task[]) =>
      tasks
        .filter((task) => task.column === columnId)
        .map((task) => {
          if (!searchQuery.trim()) return { ...task, isMatch: true };
          const q = searchQuery.toLowerCase();
          const isMatch =
            task.title.toLowerCase().includes(q) ||
            task.description.toLowerCase().includes(q);
          return { ...task, isMatch };
        }),
  });
}

// Mutations
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => tasksApi.create(input),
    onSuccess: (newTask) => {
      // Optimistic-style: update cache directly
      queryClient.setQueriesData<Task[]>(
        { queryKey: queryKeys.tasks.lists() },
        (old) => (old ? [...old, newTask] : [newTask])
      );
    },
    onError: () => {
      // Refetch on error to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      tasksApi.update(id, input),
    // Optimistic update
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.lists() });
      const previousTasks = queryClient.getQueriesData<Task[]>({
        queryKey: queryKeys.tasks.lists(),
      });

      queryClient.setQueriesData<Task[]>(
        { queryKey: queryKeys.tasks.lists() },
        (old) =>
          old?.map((task) => (task.id === id ? { ...task, ...input } : task))
      );

      return { previousTasks };
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        context.previousTasks.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.lists() });
      const previousTasks = queryClient.getQueriesData<Task[]>({
        queryKey: queryKeys.tasks.lists(),
      });

      queryClient.setQueriesData<Task[]>(
        { queryKey: queryKeys.tasks.lists() },
        (old) => old?.filter((task) => task.id !== id)
      );

      return { previousTasks };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTasks) {
        context.previousTasks.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}
