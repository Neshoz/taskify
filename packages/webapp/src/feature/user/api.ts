import { HttpClient } from "~/util";

const { get } = new HttpClient("/api/account");

export function fetchCurrentUser() {
  return get<User>("/me");
}
