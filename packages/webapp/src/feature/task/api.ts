import { TaskBase, TaskStatus } from "@taskify/shared-service-types";
import { HttpClient } from "~/util";

const { get } = new HttpClient("/api/collection");

export function fetchListTasks(listId: string, status: TaskStatus) {
  return get<TaskBase[]>(`/lists/${listId}/tasks?status=${status}`);
}
