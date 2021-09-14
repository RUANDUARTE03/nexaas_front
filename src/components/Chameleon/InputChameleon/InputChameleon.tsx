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
  mode: 'text' | 'select';
  options?: optionsProps[];
};

export default function InputChameleon({
  label,
  required,
  value,
  onChange,
  mode,
  options,
}: InputChameleonProps) {
  return (
    <FormControl className={Styles.containerIptChameleon}>
      <InputLabel shrink>
        {label} 
{' '}
{required && <span>*</span>}
      </InputLabel>
      {mode === 'text' ? (
        <InputBase
          id={Styles.wrapperIptChameleon}
          value={value}
          onChange={(e: any) => {
            onChange(e);
          }}
        />
      ) : (
        <NativeSelect
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
