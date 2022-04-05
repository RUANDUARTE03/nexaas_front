/* eslint-disable import/no-unresolved */

import { IErrorsGraphql } from 'src/features/brands-page/dtos';

interface IProps {
  errors: IErrorsGraphql[];
  field: ErrorsFieldsDefinitions.AvailableFields;
}

export function CheckField({ errors, field }: IProps) {
  if (errors) {
    const fieldChecked: ErrorsFieldsDefinitions.AvailableFields[] =
      errors.map((error) => {
        let fieldReturned;
        const fieldError = error.path.find(
          (i) => i === field
        );

        if (fieldError !== undefined) {
          fieldReturned = fieldError;
        }

        return fieldReturned;
      });

    return fieldChecked.find(
      (i) => i !== undefined && i !== null
    );
  }
}

export function CheckErrors({ errors, field }: IProps) {
  const error = errors.map((err) => {
    let errorReturned;
    const check = err.path.includes(field);
    if (check) errorReturned = err;
    return errorReturned;
  });
  const errorExacted = error.find(
    (i) => i !== undefined && i !== null
  );
  return errorExacted;
}

export function RemoveErrorField({
  errors,
  field,
}: IProps) {
  const removeErrorSpecified = errors.filter((item) => {
    return !item.path.includes(field);
  });

  return removeErrorSpecified;
}
