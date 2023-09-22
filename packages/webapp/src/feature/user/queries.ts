import { useQuery } from "react-query";
import { TEN_MINUTES } from "~/util";
import { fetchCurrentUser, searchUsers } from "./api";

const currentUserQueryKey = "current-user";

export function useCurrentUserQuery() {
  return useQuery(currentUserQueryKey, fetchCurrentUser, {
    staleTime: TEN_MINUTES,
    cacheTime: TEN_MINUTES,
  });
}

export function useSearchUsersQuery(searchTerm: string) {
  return useQuery([searchTerm], () => searchUsers(searchTerm), {
    enabled: !!searchTerm,
  });
}
