import { createContext, ReactNode, useEffect, useState } from "react";
import { useWindowEvent } from "@mantine/hooks";
import { ServerError, useGuardedContext } from "~/util";
import { FullscreenLoader } from "~/components";
import { useCurrentUserQuery } from "../user";
import { useLoginMutation, useLogoutMutation } from "./mutations";
import { fetchCurrentUser } from "../user/api";

interface AuthContext {
  isAuthenticated: boolean;
  loading: {
    login: boolean;
    logout: boolean;
  };
  errors: {
    login: ServerError | null;
    logout: ServerError | null;
  };
  login: (credentials: Credentials) => Promise<Response>;
  logout: () => void;
}

const Context = createContext<AuthContext | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  useEffect(() => {
    fetchCurrentUser()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  useWindowEvent("unAuthorized", (_: UnAuthorizedEvent) => {
    setIsAuthenticated(false);
  });

  const login = (credentials: Credentials) => {
    return loginMutation.mutateAsync(credentials, {
      onSuccess: () => setIsAuthenticated(true),
    });
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const value: AuthContext = {
    isAuthenticated,
    login,
    logout,
    loading: {
      login: loginMutation.isLoading,
      logout: logoutMutation.isLoading,
    },
    errors: {
      login: loginMutation.error,
      logout: logoutMutation.error,
    },
  };

  if (isLoading) {
    return <FullscreenLoader />;
  }

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export function useAuth() {
  return useGuardedContext(Context);
}
