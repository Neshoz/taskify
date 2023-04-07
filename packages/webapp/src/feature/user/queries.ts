import { useQuery } from "react-query";
import { TEN_MINUTES } from "~/util";
import { fetchCurrentUser } from "./api";

const currentUserQueryKey = "current-user";

export function useCurrentUserQuery() {
  return useQuery(currentUserQueryKey, fetchCurrentUser, {
    staleTime: TEN_MINUTES,
    cacheTime: TEN_MINUTES,
  });
}
