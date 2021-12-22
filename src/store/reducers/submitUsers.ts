import {
  SUBMIT_USER,
  CLEAR_USER,
} from '../actions/submitUsers';

const initialState: {
  type: 'create' | 'edit' | '';
} = {
  type: '',
};

export default function reducer(
  state = initialState,
  action: {
    type: typeof SUBMIT_USER | typeof CLEAR_USER;
    payload: 'create' | 'edit' | '';
  }
): typeof initialState {
  switch (action.type) {
    case SUBMIT_USER:
      return {
        ...state,
        type: action.payload,
      };
    case CLEAR_USER:
      return {
        ...state,
        type: '',
      };
    default:
      return state;
  }
}
