declare namespace ApplicationWindow {
  export type Size = {
    width: number | undefined;
    height: number | undefined;
  };
}

type STORE_DEFINITION = ReturnType<
  typeof import('store').default['getState']
>;
