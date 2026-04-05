export const queryKeys = {
  tasks: {
    all: ["tasks"] as const,
    lists: () => [...queryKeys.tasks.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.tasks.lists(), filters] as const,
    details: () => [...queryKeys.tasks.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.tasks.details(), id] as const,
  },
} as const;
