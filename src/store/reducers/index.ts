import { combineReducers } from 'redux';
import SubmitProvider from './submitProviders';
import SubmitOrganization from './submitOrganization';

export default combineReducers({
  SubmitProvider,
  SubmitOrganization,
});
