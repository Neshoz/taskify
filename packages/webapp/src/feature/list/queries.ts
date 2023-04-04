import { useQuery } from "react-query";
import { fetchList, fetchUserLists } from "./api";

const listsQueryKey = "lists";

export function useListsQuery() {
  return useQuery(listsQueryKey, fetchUserLists);
}

export function useListQuery(listId: string) {
  return useQuery([listsQueryKey, listId], () => fetchList(listId));
}
