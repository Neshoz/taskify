import { ApiUser } from "@taskify/shared-service-types";
import { IncomingHttpHeaders } from "http";
import { ServiceClient } from "../ServiceClient";

const client = new ServiceClient("http://account-service:8001");

async function getSession(headers: IncomingHttpHeaders) {
  return client.get<{ userId: string; sessionId: string }>({
    path: "/validate-session",
    headers,
  });
}

export function getUsers({
  headers,
  users,
}: {
  headers: IncomingHttpHeaders;
  users: string[];
}) {
  return client.post<ApiUser[]>({
    path: "/users/search",
    headers,
    body: { users },
  });
}

export function searchUsers({
  headers,
  searchTerm,
}: {
  headers: IncomingHttpHeaders;
  searchTerm: string;
}) {
  return client.get<ApiUser[]>({
    path: `/users/search?term=${searchTerm}`,
    headers,
  });
}

export const accountServiceClient = {
  getSession,
  getUsers,
  searchUsers,
};
