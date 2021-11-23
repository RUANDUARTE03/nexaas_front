import {
  SUBMIT_ORGANIZATION,
  CLEAR_ORGANIZATION,
} from '../actions/SubmitOrganizations';

const initialState: {
  type: 'create' | 'edit' | '';
} = {
  type: '',
};

export default function reducer(
  state = initialState,
  action: {
    type:
      | typeof SUBMIT_ORGANIZATION
      | typeof CLEAR_ORGANIZATION;
    payload: 'create' | 'edit' | '';
  }
): typeof initialState {
  switch (action.type) {
    case SUBMIT_ORGANIZATION:
      return {
        ...state,
        type: action.payload,
      };
    case CLEAR_ORGANIZATION:
      return {
        ...state,
        type: '',
      };
    default:
      return state;
  }
}
