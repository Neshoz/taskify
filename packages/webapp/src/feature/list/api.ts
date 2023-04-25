import {
  ApiList,
  CreateListInput,
  AddUsersToListInput,
  ListUser,
} from "@taskify/shared-service-types";
import { HttpClient } from "~/util";

const { get, post, put } = new HttpClient("/api/collection");

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

export function inviteUsersToList(payload: InviteUsersToListVariables) {
  const { listId, users } = payload;
  return put<AddUsersToListInput[]>(`/lists/${listId}/users`, users);
}
