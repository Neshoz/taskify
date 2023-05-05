import {
  AddUsersToListInput,
  ApiList,
  CreateListInput,
  ListPermission,
  ListUser,
  UpdateListUserPermissionsResponse,
} from "@taskify/shared-service-types";
import { HttpClient } from "~/util";
import {
  RemoveListUserVariables,
  UpdateListUserPermissionsVariables,
  UpdateListVariables,
} from "./types";

const { get, post, put, delete: del } = new HttpClient("/api/collection");

export function fetchUserLists() {
  return get<ApiList[]>("/lists");
}

export function fetchList(listId: string) {
  return get<ApiList>(`/lists/${listId}`);
}

export function fetchListUsers(listId: string) {
  return get<ListUser[]>(`/lists/${listId}/users`);
}

export function createList(input: CreateListInput) {
  return post<ApiList>(`/lists`, input);
}

export function updateList({ listId, name }: UpdateListVariables) {
  return put<ApiList>(`/lists/${listId}`, { name });
}

export function addUserToList(listId: string, user: AddUsersToListInput) {
  return post<AddUsersToListInput>(`/lists/${listId}/users`, user);
}

export function updateListUserPermissions({
  listId,
  userId,
  permissions,
}: UpdateListUserPermissionsVariables) {
  return put<UpdateListUserPermissionsResponse>(
    `/lists/${listId}/users/${userId}`,
    { permissions }
  );
}

export function removeListUser({ listId, userId }: RemoveListUserVariables) {
  return del(`/lists/${listId}/users/${userId}`);
}
