export type PolymorphicComponentProps<
  Element extends React.ElementType,
  Props
> = Props &
  Omit<React.ComponentProps<Element>, keyof Props | "as"> & {
    as?: Element;
  };
