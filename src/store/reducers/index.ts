import { combineReducers } from 'redux';
import SubmitProvider from './submitProviders';
import SubmitOrganizations from './submitOrganization';
import SubmitUsers from './submitUsers';
import SubmitBrands from './submitBrands';
import SubmitManufacturer from './submitManufacturer';

export default combineReducers({
  SubmitProvider,
  SubmitOrganizations,
  SubmitUsers,
  SubmitBrands,
  SubmitManufacturer,
});
