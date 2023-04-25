import { showNotification } from "@mantine/notifications";
import { AddUsersToListInput } from "@taskify/shared-service-types";
import { useMutation, useQueryClient } from "react-query";
import { ServerError } from "~/util";
import { createList, inviteUsersToList } from "./api";
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

export function useInviteUsersToListMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    AddUsersToListInput[],
    ServerError,
    InviteUsersToListVariables
  >({
    mutationFn: inviteUsersToList,
    onSuccess: (_, variables) => {
      showNotification({
        title: "Success invited users",
        message: "New users have been invited to your collection",
        color: "teal",
      });
      queryClient.invalidateQueries([listsQueryKey, variables.listId]);
    },
  });
}
