export const SUBMIT_MANUFACTURER = 'submit_manufacturer';
export const CLEAR_MANUFACTURER = 'clear_manufacturer';

export function submitManufacturers({
  type,
}: {
  type: 'edit' | 'create';
}) {
  return {
    type: SUBMIT_MANUFACTURER,
    payload: type,
  };
}

export function clearSubmit() {
  return {
    type: CLEAR_MANUFACTURER,
  };
}
