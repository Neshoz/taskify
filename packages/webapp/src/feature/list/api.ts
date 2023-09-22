import {
  AddUsersToListInput,
  ApiList,
  CreateListInput,
  ListUser,
  UpdateListUserPermissionsResponse,
} from "@taskify/shared-service-types";
import { client } from "~/api";
import {
  RemoveListUserVariables,
  UpdateListUserPermissionsVariables,
  UpdateListVariables,
} from "./types";

export function fetchUserLists() {
  return client.get<ApiList[]>("/collections");
}

export function fetchList(listId: string) {
  return client.get<ApiList>(`/collections/${listId}`);
}

export function fetchListUsers(listId: string) {
  return client.get<ListUser[]>(`/collections/${listId}/users`);
}

export function createList(input: CreateListInput) {
  return client.post<ApiList>(`/collections`, input);
}

export function updateList({ listId, name }: UpdateListVariables) {
  return client.put<ApiList>(`/collections/${listId}`, { name });
}

export function addUserToList(listId: string, user: AddUsersToListInput) {
  return client.post<AddUsersToListInput>(`/collections/${listId}/users`, user);
}

export function updateListUserPermissions({
  listId,
  userId,
  permissions,
}: UpdateListUserPermissionsVariables) {
  return client.put<UpdateListUserPermissionsResponse>(
    `/collections/${listId}/users/${userId}`,
    { permissions }
  );
}

export function removeListUser({ listId, userId }: RemoveListUserVariables) {
  return client.delete(`/collections/${listId}/users/${userId}`);
}
