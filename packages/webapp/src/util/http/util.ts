import { AuthenticationError } from "./AuthenticationError";
import { ServerError } from "./ServerError";

export function isAuthenticationError(
  error: Error
): error is AuthenticationError {
  return error.name === "AuthenticationError";
}

export function isServerError(error: Error): error is ServerError {
  return error.name === "ServerError";
}

export function dispatchUnAuthorizedEvent() {
  window.dispatchEvent(
    new CustomEvent<UnAuthorizedEvent["detail"]>("unAuthorized", {
      detail: { returnUrl: location.pathname },
    })
  );
}
