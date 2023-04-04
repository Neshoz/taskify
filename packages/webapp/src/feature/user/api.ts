import { ApiUser } from "@taskify/shared-service-types";
import { HttpClient } from "~/util";

const { get } = new HttpClient("/api/account");

export function fetchCurrentUser() {
  return get<ApiUser>("/me");
}
