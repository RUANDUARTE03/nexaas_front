import {
  SUBMIT_PROVIDER,
  CLEAR_PROVIDER,
} from '../actions/SubmitProviders';

const initialState: {
  type: 'create' | 'edit' | '';
} = {
  type: '',
};

export default function reducer(
  state = initialState,
  action: {
    type: typeof SUBMIT_PROVIDER | typeof CLEAR_PROVIDER;
    payload: 'create' | 'edit' | '';
  }
): typeof initialState {
  switch (action.type) {
    case SUBMIT_PROVIDER:
      return {
        ...state,
        type: action.payload,
      };
    case CLEAR_PROVIDER:
      return {
        ...state,
        type: '',
      };
    default:
      return state;
  }
}
