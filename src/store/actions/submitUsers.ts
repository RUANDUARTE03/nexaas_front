export const SUBMIT_USER = 'submit_user';
export const CLEAR_USER = 'clear_user';

export function submitUser({
  type,
}: {
  type: 'edit' | 'create';
}) {
  return {
    type: SUBMIT_USER,
    payload: type,
  };
}

export function clearSubmit() {
  return {
    type: CLEAR_USER,
  };
}
