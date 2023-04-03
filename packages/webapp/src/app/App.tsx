import { BrowserRouter, Link, Redirect, Route, Switch } from "react-router-dom";
import { LazyRoute } from "~/components";
import { routes } from "./routes";

export const App = () => (
  <BrowserRouter>
    <Switch>
      <LazyRoute
        exact
        path={routes.dashboard.path}
        component={routes.dashboard.component}
      />
      <Route exact path="/test" render={() => <Link to="/">Dashboard</Link>} />
      <Redirect to={routes.dashboard.path} />
    </Switch>
  </BrowserRouter>
);
