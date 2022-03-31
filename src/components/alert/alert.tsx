/* eslint-disable import/no-unresolved */
import React from 'react';
import { IErrorsGraphql } from 'src/features/brands-page/dtos';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

interface IProps {
  errors: IErrorsGraphql[];
  type: 'error' | 'success';
}

export default function AlertCustom({
  errors,
  type,
}: IProps) {
  return (
    <Alert severity={type}>
      <AlertTitle>A validação falhou:</AlertTitle>
      {errors.map((err) => {
        return (
          <ul>
            <li>{err.message}</li>
          </ul>
        );
      })}
    </Alert>
  );
}
