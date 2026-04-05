import axios from "axios";
import { Task, CreateTaskInput, UpdateTaskInput } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://69d2ba665043d95be972236a.mockapi.io";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor for logging
apiClient.interceptors.request.use((config) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});

const transformTaskFromApi = (apiTask: any): Task => {
  // Determine column string from booleans
  let column: Task["column"] = "backlog";
  if (apiTask.done_column) column = "done";
  else if (apiTask.review_column) column = "review";
  else if (apiTask.in_progress_column) column = "in_progress";
  else if (apiTask.backlog_column) column = "backlog";

  return {
    id: apiTask.id,
    title: apiTask.title,
    description: apiTask.description,
    priority: apiTask.priority ? "high" : "low",
    column,
    createdAt: new Date(apiTask.createdAt * 1000).toISOString(),
  };
};

const transformTaskToApi = (task: Partial<Task>): any => {
  const apiTask: any = { ...task };
  
  if (task.priority) {
    apiTask.priority = task.priority === "high";
  }
  
  if (task.column) {
    apiTask.backlog_column = task.column === "backlog";
    apiTask.in_progress_column = task.column === "in_progress";
    apiTask.review_column = task.column === "review";
    apiTask.done_column = task.column === "done";
    delete apiTask.column;
  }
  
  if (task.createdAt) {
    apiTask.createdAt = Math.floor(new Date(task.createdAt).getTime() / 1000);
  }
  
  return apiTask;
};

export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    const { data } = await apiClient.get<any[]>("/tasks");
    return data.map(transformTaskFromApi);
  },

  getById: async (id: string): Promise<Task> => {
    const { data } = await apiClient.get<any>(`/tasks/${id}`);
    return transformTaskFromApi(data);
  },

  create: async (input: CreateTaskInput): Promise<Task> => {
    const apiInput = transformTaskToApi({
      ...input,
      createdAt: new Date().toISOString(),
    });
    const { data } = await apiClient.post<any>("/tasks", apiInput);
    return transformTaskFromApi(data);
  },

  update: async (id: string, input: UpdateTaskInput): Promise<Task> => {
    const apiInput = transformTaskToApi(input);
    const { data } = await apiClient.put<any>(`/tasks/${id}`, apiInput);
    return transformTaskFromApi(data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
