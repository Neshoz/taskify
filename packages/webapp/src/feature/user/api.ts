import { ApiUser } from "@taskify/shared-service-types";
import { client } from "~/api";

export function fetchCurrentUser() {
  return client.get<ApiUser>("/account/me");
}

export function searchUsers(searchTerm: string) {
  return client.get<ApiUser[]>(`/account/users/search?term=${searchTerm}`);
}
