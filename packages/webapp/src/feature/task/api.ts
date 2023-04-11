import { CreateTaskInput, TaskBase } from "@taskify/shared-service-types";
import { HttpClient, toQueryParams } from "~/util";
import { TaskFilters, UpdateTaskVariables } from "./types";

const { get, post, put, delete: del } = new HttpClient("/api/collection");

export function fetchListTasks(listId: string, filters?: Partial<TaskFilters>) {
  return get<TaskBase[]>(`/lists/${listId}/tasks${toQueryParams(filters)}`);
}

export function createTask({ listId, ...body }: CreateTaskInput) {
  const payload: Omit<CreateTaskInput, "listId"> = {
    ...body,
    dueDate: body.dueDate ? new Date(body.dueDate).toISOString() : null,
  };
  return post<TaskBase>(`/lists/${listId}/tasks`, payload);
}

export function updateTask(input: UpdateTaskVariables) {
  const { listId, taskId, ...body } = input;
  return put<TaskBase>(`/lists/${listId}/tasks/${taskId}`, body);
}

export function deleteTask(listId: string, taskId: string) {
  return del<{ success: boolean }>(`/lists/${listId}/tasks/${taskId}`);
}
