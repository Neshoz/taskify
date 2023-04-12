import { useQuery } from "react-query";
import { fetchListTasks } from "./api";
import { TaskFilters } from "./types";

export const tasksQueryKey = "tasks";

export function useListTasksQuery(
  listId: string,
  filters?: Partial<TaskFilters>
) {
  return useQuery([tasksQueryKey, listId, filters], () =>
    fetchListTasks(listId, filters)
  );
}
