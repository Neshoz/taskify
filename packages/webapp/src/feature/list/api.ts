import { ApiList } from "@taskify/shared-service-types";
import { HttpClient } from "~/util";

const { get } = new HttpClient("/api/collection");

export function fetchUserLists() {
  return get<ApiList[]>("/lists");
}

export function fetchList(listId: string) {
  return get<ApiList>(`/lists/${listId}`);
}
