export const SUBMIT_ORGANIZATION = 'submit_organization';
export const CLEAR_ORGANIZATION = 'clear_organization';

export function submitOrganization({
  type,
}: {
  type: 'edit' | 'create';
}) {
  return {
    type: SUBMIT_ORGANIZATION,
    payload: type,
  };
}

export function clearSubmit() {
  return {
    type: CLEAR_ORGANIZATION,
  };
}
