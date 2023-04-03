import { ComponentType, lazy, Suspense, useMemo } from "react";
import { RouteProps } from "react-router-dom";
import { FullscreenLoader } from "../FullscreenLoader";

export interface RouteConfig {
  path: string;
  component: () => Promise<{ default: ComponentType<any> }>;
}

type Props = Omit<RouteProps, "component"> & RouteConfig;

export const LazyRoute = ({ component, ...rest }: Props) => {
  const Component = useMemo(() => lazy(component), []);

  return (
    <Suspense fallback={<FullscreenLoader />}>
      <Component />
    </Suspense>
  );
};
