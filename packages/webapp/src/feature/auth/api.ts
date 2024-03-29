import { client } from "~/api";

export function login(credentials: Credentials) {
  return fetch("/api/account/signin", {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: { "Content-Type": "application/json" },
  });
}

export function logout() {
  return client.post("/account/signout");
}
