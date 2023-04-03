import { RouteConfig } from "~/components";

export const routes: Record<string, RouteConfig> = {
  dashboard: {
    path: "/",
    component: () => import("./pages/dashboard"),
  },
};
