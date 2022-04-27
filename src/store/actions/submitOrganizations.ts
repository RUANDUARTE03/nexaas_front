export const SUBMIT_ORGANIZATIONS = 'submit_organizations';
export const CLEAR_ORGANIZATIONS = 'clear_organizations';

export function SubmitOrganizations({
  type,
}: {
  type: ApplicationDefinitions.TypeActions;
}) {
  return {
    type: SUBMIT_ORGANIZATIONS,
    payload: type,
  };
}

export function clearSubmit() {
  return {
    type: CLEAR_ORGANIZATIONS,
  };
}
