import { useQuery } from "react-query";
import { fetchCurrentUser } from "./api";

const currentUserQueryKey = "current-user";

export function useCurrentUserQuery() {
  return useQuery(currentUserQueryKey, fetchCurrentUser);
}
