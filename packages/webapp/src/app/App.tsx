import { AppShell } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { Sidebar } from "./components";

export const App = () => (
  <BrowserRouter>
    <AppShell navbar={<Sidebar />}>
      <AppRoutes />
    </AppShell>
  </BrowserRouter>
);
