import {
  SUBMIT_MANUFACTURER,
  CLEAR_MANUFACTURER,
} from '../actions/submitManufacturers';

const initialState: {
  type: ApplicationDefinitions.TypeActions;
} = {
  type: '',
};

export default function reducer(
  state = initialState,
  action: {
    type:
      | typeof SUBMIT_MANUFACTURER
      | typeof CLEAR_MANUFACTURER;
    payload: 'create' | 'edit' | 'delete' | '';
  }
): typeof initialState {
  switch (action.type) {
    case SUBMIT_MANUFACTURER:
      return {
        ...state,
        type: action.payload,
      };
    case CLEAR_MANUFACTURER:
      return {
        ...state,
        type: '',
      };
    default:
      return state;
  }
}
