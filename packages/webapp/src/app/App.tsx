import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Dashboard } from "./pages";
import { paths } from "./paths";

export const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={paths.dashboard} component={Dashboard} />
      <Redirect to={paths.dashboard} />
    </Switch>
  </BrowserRouter>
);
