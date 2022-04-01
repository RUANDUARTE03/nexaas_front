/* eslint-disable import/no-unresolved */
import React from 'react';
import { IErrorsGraphql } from 'src/features/brands-page/dtos';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

interface IProps {
  errors: IErrorsGraphql[];
  type: 'error' | 'success';
  typeReducer: 'create' | 'edit' | 'delete';
  onClose: () => void;
  messageType?: 'brand';
}

export default function AlertCustom({
  errors,
  type,
  onClose,
  messageType,
  typeReducer,
}: IProps) {
  return (
    <Alert
      severity={type}
      onClose={() => {
        onClose();
      }}
    >
      {type === 'error' && (
        <AlertTitle>A validação falhou:</AlertTitle>
      )}
      {errors &&
        errors.map((err) => {
          return (
            <ul>
              <li>{err.message}</li>
            </ul>
          );
        })}
      {messageType && !errors && (
        <ul>
          <li>
            {`${
              messageType === 'brand' &&
              typeReducer === 'delete' &&
              'Marca excluída com sucesso!'
            }`}
          </li>
          <li>
            {`${
              messageType === 'brand' &&
              typeReducer === 'edit' &&
              'Marca editada com sucesso!'
            }`}
          </li>
          <li>
            {`${
              messageType === 'brand' &&
              typeReducer === 'create' &&
              'Marca criada com sucesso!'
            }`}
          </li>
        </ul>
      )}
    </Alert>
  );
}
