export const SUBMIT_USERS = 'submit_users';
export const CLEAR_USERS = 'clear_users';

export function submitUsers({
  type,
}: {
  type: ApplicationDefinitions.TypeActions;
}) {
  return {
    type: SUBMIT_USERS,
    payload: type,
  };
}

export function clearSubmit() {
  return {
    type: CLEAR_USERS,
  };
}
