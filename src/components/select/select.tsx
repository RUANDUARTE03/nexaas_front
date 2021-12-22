import React from 'react';
import {
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';

/* eslint-disable react/jsx-wrap-multilines */

type SelectProps = {
  checked: boolean;
  onChecked: (e: any) => void;
  title: string;
};

export default function Select({
  checked,
  onChecked,
  title,
}: SelectProps) {
  return (
    <FormControlLabel
      label={title}
      control={
        <Checkbox
          checked={checked}
          onChange={(e: any) => {
            onChecked(e);
          }}
          style={{
            color: '#1675db',
          }}
        />
      }
    />
  );
}
