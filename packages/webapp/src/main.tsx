import React from "react";
import ReactDOM from "react-dom/client";
import { AppGuard } from "./AppGuard";
import { Root } from "./Root";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Root>
      <AppGuard />
    </Root>
  </React.StrictMode>
);
