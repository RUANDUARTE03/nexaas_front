/* eslint-disable no-unused-vars */
import { merge } from 'lodash';
import {
  applyMiddleware,
  createStore,
  DeepPartial,
} from 'redux';
import thunk from 'redux-thunk';
import mainReducers from '../../store/reducers';

const INITIAL_STORE = () => ({});

export const mockStore = (
  overrideProperties: DeepPartial<STORE_DEFINITION> = {}
) => {
  const store = createStore(
    mainReducers,
    merge(INITIAL_STORE(), overrideProperties) as any,
    applyMiddleware(thunk)
  );
  return store;
};
