import { useQuery } from "react-query";
import { fetchListTasks } from "./api";
import { TaskStatus } from "@taskify/shared-service-types";

export const tasksQueryKey = "tasks";

export function useListTasksQuery(listId: string, status: TaskStatus = 0) {
  return useQuery([tasksQueryKey, listId], () => fetchListTasks(listId, status));
}
