import { QueryStatus } from "react-query";

export function some(withStatus: QueryStatus, ...statuses: QueryStatus[]) {
  return statuses.some((status) => status === withStatus);
}

export function every(withStatus: QueryStatus, ...statuses: QueryStatus[]) {
  return statuses.every((status) => status === withStatus);
}
