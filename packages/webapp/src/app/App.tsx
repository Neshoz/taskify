import { AppShell } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { AppHeader } from "./components";

export const App = () => (
  <BrowserRouter>
    <AppShell header={<AppHeader />}>
      <AppRoutes />
    </AppShell>
  </BrowserRouter>
);
