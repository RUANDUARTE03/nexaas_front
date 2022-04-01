export const SUBMIT_BRAND = 'submit_brand';
export const CLEAR_BRAND = 'clear_brand';

export function submitBrand({
  type,
}: {
  type: 'edit' | 'create' | 'delete';
}) {
  return {
    type: SUBMIT_BRAND,
    payload: type,
  };
}

export function clearSubmit() {
  return {
    type: CLEAR_BRAND,
  };
}
