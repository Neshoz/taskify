import { useHistory } from "react-router-dom";
import { useMutation } from "react-query";
import { login, logout } from "./api";
import { ServerError } from "~/util";

export function useLoginMutation() {
  return useMutation<Response, ServerError, Credentials>({
    mutationFn: login,
  });
}

export function useLogoutMutation() {
  const history = useHistory();

  return useMutation<unknown, ServerError>({
    mutationFn: logout,
    onSuccess: () => {
      history.replace("/login");
    },
  });
}
