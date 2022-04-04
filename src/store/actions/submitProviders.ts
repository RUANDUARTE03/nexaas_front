export const SUBMIT_PROVIDER = 'submit_provider';
export const CLEAR_PROVIDER = 'clear_provider';

export function submitProvider({
  type,
}: {
  type: ApplicationDefinitions.TypeActions;
}) {
  return {
    type: SUBMIT_PROVIDER,
    payload: type,
  };
}

export function clearSubmit() {
  return {
    type: CLEAR_PROVIDER,
  };
}
