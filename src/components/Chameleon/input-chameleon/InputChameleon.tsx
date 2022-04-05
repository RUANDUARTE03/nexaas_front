/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import InputBase from '@material-ui/core/InputBase';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import { IErrorsGraphql } from 'src/features/brands-page/dtos';
import {
  CheckErrors,
  CheckField,
  RemoveErrorField,
} from '../../../utils/formatters/checkErrors';
import Styles from './inputChameleon.module.scss';

/* eslint-disable no-unused-vars */

type optionsProps = {
  value: string | number;
  label: string;
};

type InputChameleonProps = {
  label: string;
  required?: boolean;
  value: string | number;
  onChange: (e: any) => void;
  onKeyUp?: (e: any) => void;
  mode: 'text' | 'select';
  options?: optionsProps[];
  type?: 'text' | 'number';
  disabled?: boolean;
  dataCy?: string;
  // Optional until migration is complete
  labelV2?: ErrorsFieldsDefinitions.AvailableFields;
  errors?: IErrorsGraphql[];
  setErrors?: (errors: IErrorsGraphql[]) => void;
};

export default function InputChameleon({
  label,
  required,
  value,
  onChange,
  onKeyUp,
  mode,
  options,
  type,
  disabled,
  dataCy,
  labelV2,
  errors,
  setErrors,
}: InputChameleonProps) {
  const [nameFieldError, setNameFieldErrors] =
    useState<ErrorsFieldsDefinitions.AvailableFields>();
  const [errorExacted, setErrorExacted] =
    useState<IErrorsGraphql>();

  useEffect(() => {
    if (errors && labelV2) {
      const field: ErrorsFieldsDefinitions.AvailableFields =
        CheckField({
          errors,
          field: labelV2,
        });

      setNameFieldErrors(field);
    }
  }, [errors, labelV2]);

  useEffect(() => {
    if (nameFieldError && errors && labelV2) {
      const error = CheckErrors({
        errors,
        field: labelV2,
      });

      setErrorExacted(error);
    }
  }, [nameFieldError, labelV2, errors]);

  const removeErrors = () => {
    if (errors && labelV2 && setErrors) {
      const removeErrorSpecified = RemoveErrorField({
        errors,
        field: labelV2,
      });
      setErrors(removeErrorSpecified);
    }
  };

  return (
    <FormControl className={Styles.containerIptChameleon}>
      <InputLabel shrink>
        {label} {required && <span>*</span>}
      </InputLabel>
      {mode === 'text' ? (
        <InputBase
          disabled={disabled}
          type={type}
          style={{ width: '100%' }}
          id={Styles.wrapperIptChameleon}
          value={value}
          onChange={(e: any) => {
            onChange(e);
          }}
          onKeyUp={(e: any) =>
            onKeyUp ? onKeyUp(e) : null
          }
          onKeyDown={() => removeErrors()}
          data-cy={dataCy}
        />
      ) : (
        <NativeSelect
          style={{ width: '100%' }}
          value={value}
          onChange={(e) => {
            onChange(e);
          }}
          input={
            <InputBase id={Styles.wrapperIptChameleon} />
          }
          data-cy={dataCy}
        >
          <option aria-label="None" value={0} />
          {options.map((o) => (
            <option value={o.value}>{o.label}</option>
          ))}
        </NativeSelect>
      )}
      {nameFieldError === labelV2 && (
        <p
          data-cy={`${dataCy}-error`}
          className={Styles.messageErrorInput}
        >
          {errorExacted?.message}
        </p>
      )}
    </FormControl>
  );
}
