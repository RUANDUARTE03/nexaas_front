import { combineReducers } from 'redux';
import SubmitProvider from './submitProviders';
import SubmitOrganization from './submitOrganization';
import SubmitUser from './submitUsers';
import SubmitBrands from './submitBrands';

export default combineReducers({
  SubmitProvider,
  SubmitOrganization,
  SubmitUser,
  SubmitBrands,
});
