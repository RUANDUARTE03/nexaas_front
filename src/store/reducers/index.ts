import { combineReducers } from 'redux';
import SubmitProvider from './SubmitProviders';
import SubmitOrganization from './SubmitOrganization';

export default combineReducers({
  SubmitProvider,
  SubmitOrganization,
});
