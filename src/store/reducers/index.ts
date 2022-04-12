import { combineReducers } from 'redux';
import SubmitProvider from './submitProviders';
import SubmitOrganization from './submitOrganization';
import SubmitUser from './submitUsers';
import SubmitBrands from './submitBrands';
import SubmitManufacturer from './submitManufacturer';

export default combineReducers({
  SubmitProvider,
  SubmitOrganization,
  SubmitUser,
  SubmitBrands,
  SubmitManufacturer,
});
