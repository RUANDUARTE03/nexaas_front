import redux from 'redux';
import reactRedux from 'react-redux';
import { PropsWithChildren } from 'react';

type STORE_DEFINITION = ReturnType<
  typeof import('store').default['getState']
>;

declare module 'react-redux' {
  export function useSelector<K>(
    callback: (state: STORE_DEFINITION) => K
  ): K;
}
