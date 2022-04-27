import {
  SUBMIT_ORGANIZATIONS,
  CLEAR_ORGANIZATIONS,
} from '../actions/submitOrganizations';

const initialState: {
  type: ApplicationDefinitions.TypeActions;
} = {
  type: '',
};

export default function reducer(
  state = initialState,
  action: {
    type:
      | typeof SUBMIT_ORGANIZATIONS
      | typeof CLEAR_ORGANIZATIONS;
    payload: 'create' | 'edit' | 'delete' | '';
  }
): typeof initialState {
  switch (action.type) {
    case SUBMIT_ORGANIZATIONS:
      return {
        ...state,
        type: action.payload,
      };
    case CLEAR_ORGANIZATIONS:
      return {
        ...state,
        type: '',
      };
    default:
      return state;
  }
}
