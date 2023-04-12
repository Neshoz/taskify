import { useMutation, useQueryClient } from "react-query";
import { showNotification } from "@mantine/notifications";
import { createTask, deleteTask, updateTask } from "./api";
import { tasksQueryKey } from "./queries";

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries([tasksQueryKey, data.listId]);
    },
  });
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries([tasksQueryKey, data.listId]);
    },
  });
}

export function useDeleteTaskMutation(listId: string, taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteTask(listId, taskId),
    onSuccess: () => {
      showNotification({
        title: "Success",
        message: "Task deleted sucessfully",
        color: "teal",
      });
      queryClient.invalidateQueries([tasksQueryKey, listId]);
    },
  });
}
