import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "react-query";
import { createList } from "./api";
import { listsQueryKey } from "./queries";

export function useCreateListMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createList,
    onSuccess: (data) => {
      showNotification({
        title: "Success",
        message: `A new list with name ${data.name} has been created!`,
        color: "teal",
      });
      queryClient.invalidateQueries(listsQueryKey);
    },
  });
}
