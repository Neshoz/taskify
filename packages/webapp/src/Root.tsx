import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ReactNode } from "react";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./api";
import { AuthProvider } from "./feature";

interface Props {
  children: ReactNode;
}

export const Root = ({ children }: Props) => (
  <QueryClientProvider client={queryClient}>
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <AuthProvider>
        <Notifications />
        {children}
      </AuthProvider>
    </MantineProvider>
  </QueryClientProvider>
);
