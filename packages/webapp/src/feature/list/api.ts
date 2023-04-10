import { ApiList, CreateListInput } from "@taskify/shared-service-types";
import { HttpClient } from "~/util";

const { get, post } = new HttpClient("/api/collection");

export function fetchUserLists() {
  return get<ApiList[]>("/lists");
}

export function fetchList(listId: string) {
  return get<ApiList>(`/lists/${listId}`);
}

export function fetchListUsers(listId: string) {
  return get<string[]>(`/lists/${listId}/users`);
}

export function createList(input: CreateListInput) {
  return post<ApiList>(`/lists`, input);
}
