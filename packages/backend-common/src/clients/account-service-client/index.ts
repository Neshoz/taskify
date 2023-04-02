import { ServiceClient } from "../ServiceClient";

const client = new ServiceClient("http://account-service:8001");

async function getSession(sessionId: string) {
  return client.get<{ userId: string; sessionId: string }>({
    path: "/validate-session",
    session: sessionId,
  });
}

export const authClient = {
  getSession,
};
