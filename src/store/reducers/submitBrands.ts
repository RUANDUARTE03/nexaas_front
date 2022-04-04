import {
  SUBMIT_BRAND,
  CLEAR_BRAND,
} from '../actions/submitBrands';

const initialState: {
  type: ApplicationDefinitions.TypeActions;
} = {
  type: '',
};

export default function reducer(
  state = initialState,
  action: {
    type: typeof SUBMIT_BRAND | typeof CLEAR_BRAND;
    payload: 'create' | 'edit' | 'delete' | '';
  }
): typeof initialState {
  switch (action.type) {
    case SUBMIT_BRAND:
      return {
        ...state,
        type: action.payload,
      };
    case CLEAR_BRAND:
      return {
        ...state,
        type: '',
      };
    default:
      return state;
  }
}
