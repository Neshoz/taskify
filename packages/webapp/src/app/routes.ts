export const routes = {
  dashboard: {
    path: "/",
    component: () => import("./pages/dashboard"),
  },
  lists: {
    path: "/lists",
    component: () => import("./pages/lists"),
  },
  list: {
    path: (listId = ":listId") => `/lists/${listId}`,
    component: () => import("./pages/list"),
  },
} as const;
