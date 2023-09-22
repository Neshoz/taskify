import { CreateTaskInput, TaskBase } from "@taskify/shared-service-types";
import { toQueryParams } from "~/util";
import { client } from "~/api";
import { TaskFilters, UpdateTaskVariables } from "./types";

export function fetchListTasks(listId: string, filters?: Partial<TaskFilters>) {
  return client.get<TaskBase[]>(
    `/collections/${listId}/tasks${toQueryParams(filters)}`
  );
}

export function createTask({ listId, ...body }: CreateTaskInput) {
  const payload: Omit<CreateTaskInput, "listId"> = {
    ...body,
    dueDate: body.dueDate ? new Date(body.dueDate).toISOString() : null,
  };
  return client.post<TaskBase>(`/collections/${listId}/tasks`, payload);
}

export function updateTask(input: UpdateTaskVariables) {
  const { listId, taskId, ...body } = input;
  return client.put<TaskBase>(`/collections/${listId}/tasks/${taskId}`, body);
}

export function deleteTask(listId: string, taskId: string) {
  return client.delete<{ success: boolean }>(
    `/collections/${listId}/tasks/${taskId}`
  );
}
