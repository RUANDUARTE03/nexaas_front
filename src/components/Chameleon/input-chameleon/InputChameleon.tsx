/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-curly-newline */
import React from 'react';
import InputBase from '@material-ui/core/InputBase';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
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
}: InputChameleonProps) {
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
        >
          <option aria-label="None" value="" />
          {options.map((o) => (
            <option value={o.value}>{o.label}</option>
          ))}
        </NativeSelect>
      )}
    </FormControl>
  );
}
