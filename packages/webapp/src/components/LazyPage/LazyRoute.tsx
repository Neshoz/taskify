import { ComponentType, lazy, Suspense, useMemo } from "react";
import { Route, RouteProps } from "react-router-dom";
import { FullscreenLoader } from "../FullscreenLoader";

export interface RouteConfig {
  path: string;
  component: () => Promise<{ default: ComponentType<any> }>;
}

type Props = Omit<RouteProps, "component"> & RouteConfig;

export const LazyPage = ({ component, ...rest }: Props) => {
  const Component = useMemo(() => lazy(component), [rest.path]);

  return (
    <Route
      {...rest}
      render={() => (
        <Suspense fallback={<FullscreenLoader />}>
          <Component />
        </Suspense>
      )}
    />
  );
};
