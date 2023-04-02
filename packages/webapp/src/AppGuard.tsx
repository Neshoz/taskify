import { App } from "./app/App";
import { useAuth } from "./feature";
import { UnAuthedApp } from "./unauthed-app/UnAuthedApp";

export const AppGuard = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <App /> : <UnAuthedApp />;
};
