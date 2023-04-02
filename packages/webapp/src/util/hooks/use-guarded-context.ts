import { useContext, Context } from "react";

export function useGuardedContext<T>(context: Context<T>) {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error(
      `Illegal consumption of context ${context.displayName}. Cannot consume context outside the scope of its provider.`
    );
  }
  return ctx;
}
