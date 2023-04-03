import { BrowserRouter, Link, Redirect, Route, Switch } from "react-router-dom";
import { LazyPage } from "~/components";
import { routes } from "./routes";

export const App = () => (
  <BrowserRouter>
    <Switch>
      <LazyPage
        exact
        path={routes.dashboard.path}
        component={routes.dashboard.component}
      />
      <Redirect to={routes.dashboard.path} />
    </Switch>
  </BrowserRouter>
);
