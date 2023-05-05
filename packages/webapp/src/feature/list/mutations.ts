import { showNotification } from "@mantine/notifications";
import {
  AddUsersToListInput,
  UpdateListUserPermissionsResponse,
} from "@taskify/shared-service-types";
import { useMutation, useQueryClient } from "react-query";
import { ServerError } from "~/util";
import {
  addUserToList,
  createList,
  removeListUser,
  updateList,
  updateListUserPermissions,
} from "./api";
import { listsQueryKey } from "./queries";
import {
  RemoveListUserVariables,
  UpdateListUserPermissionsVariables,
} from "./types";

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

export function useAddUserToListMutation(listId: string) {
  const queryClient = useQueryClient();

  return useMutation<AddUsersToListInput, ServerError, AddUsersToListInput>({
    mutationFn: (input) => addUserToList(listId, input),
    onSuccess: () => {
      showNotification({
        title: "Success",
        message: `Successfully invited collaborator`,
        color: "teal",
      });
      queryClient.invalidateQueries([listsQueryKey, listId, "users"], {
        exact: true,
      });
    },
  });
}

export function useUpdateListUserPermissionsMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateListUserPermissionsResponse,
    ServerError,
    UpdateListUserPermissionsVariables
  >({
    mutationFn: updateListUserPermissions,
    onSuccess: (_, { listId }) => {
      showNotification({
        title: "Success",
        message: "Successfully updated permissions",
        color: "teal",
      });
      queryClient.invalidateQueries([listsQueryKey, listId, "users"], {
        exact: true,
      });
    },
  });
}

export function useRemoveListUserMutation() {
  const queryClient = useQueryClient();

  return useMutation<unknown, ServerError, RemoveListUserVariables>({
    mutationFn: removeListUser,
    onSuccess: (_, { listId }) => {
      showNotification({
        title: "Success",
        message: "Successfully removed collaborator from list",
        color: "teal",
      });
      queryClient.invalidateQueries([listsQueryKey, listId, "users"], {
        exact: true,
      });
    },
  });
}

export function useUpdateListMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateList,
    onSuccess: (_, { listId }) => {
      showNotification({
        title: "Success",
        message: "List name updated successfully",
        color: "teal",
      });
      queryClient.invalidateQueries([listsQueryKey, listId], { exact: true });
    },
  });
}
