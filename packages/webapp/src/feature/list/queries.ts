import { useQuery } from "react-query";
import { ONE_HOUR } from "~/util";
import { fetchList, fetchListUsers, fetchUserLists } from "./api";

export const listsQueryKey = "lists";

export function useListsQuery() {
  return useQuery(listsQueryKey, fetchUserLists);
}

export function useListQuery(listId: string) {
  return useQuery([listsQueryKey, listId], () => fetchList(listId));
}

export function useListUsersQuery(listId: string) {
  return useQuery(
    [listsQueryKey, listId, "users"],
    () => fetchListUsers(listId),
    {
      staleTime: ONE_HOUR,
      cacheTime: ONE_HOUR,
    }
  );
}
