import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Login } from "./pages";

export const UnAuthedApp = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/login" component={Login} />
      <Redirect to="/login" />
    </Switch>
  </BrowserRouter>
);
