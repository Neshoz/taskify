import { QueryClient } from "react-query";
import { showNotification } from "@mantine/notifications";
import { isAuthenticationError, isServerError } from "../util";

const queryStatusBlackList = [401, 403, 404];
const mutationStatusBlackList = [401];
const QUERY_RETRY_MAX = 2;

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
      onError: (error: any) => {
        if (isServerError(error)) {
          if (!mutationStatusBlackList.includes(error.status)) {
            showNotification({
              color: "red",
              title: "Unable to service request",
              message: error.details.message,
            });
          }
        }
      },
    },
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      retry: (failureCount: number, error: any) => {
        if (isAuthenticationError(error)) {
          return false;
        }

        if (
          isServerError(error) &&
          queryStatusBlackList.includes(error.status)
        ) {
          return false;
        }

        return failureCount > QUERY_RETRY_MAX;
      },
    },
  },
});
