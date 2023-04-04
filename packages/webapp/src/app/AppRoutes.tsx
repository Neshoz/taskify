import { Redirect, Switch } from "react-router-dom";
import { LazyPage } from "~/components";
import { routes } from "./routes";

export const AppRoutes = () => (
  <Switch>
    <LazyPage
      exact
      path={routes.dashboard.path}
      component={routes.dashboard.component}
    />
    <LazyPage
      exact
      path={routes.lists.path}
      component={routes.lists.component}
    />
    <LazyPage
      exact
      path={routes.list.path()}
      component={routes.list.component}
    />
    <Redirect to={routes.dashboard.path} />
  </Switch>
);
