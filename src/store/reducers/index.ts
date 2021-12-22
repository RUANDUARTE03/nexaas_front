import { combineReducers } from 'redux';
import SubmitProvider from './submitProviders';
import SubmitOrganization from './submitOrganization';
import SubmitUser from './submitUsers';

export default combineReducers({
  SubmitProvider,
  SubmitOrganization,
  SubmitUser,
});
