/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
import React, { useMemo } from 'react';
import { IErrorsGraphql } from 'src/features/brands-page/dtos';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

interface IProps {
  errors: IErrorsGraphql[];
  type: 'error' | 'success';
  onClose: () => void;
  typeReducer: ApplicationDefinitions.TypeActions;
  messageType?: ApplicationDefinitions.ActionsMenu;
}

export default function AlertCustom({
  errors,
  type,
  onClose,
  messageType,
  typeReducer,
}: IProps) {
  const messageTypeSpecified: ApplicationDefinitions.ActionsMenu =
    useMemo(() => {
      if (messageType && typeReducer) {
        switch (messageType) {
          case 'brand':
            return 'marca';
          case 'provider':
            return 'fornecedor';
          default:
            return '';
        }
      }
    }, [messageType, typeReducer]);

  const messageTypeSpecifiedComplement: ApplicationDefinitions.TypeActionsMessages =
    useMemo(() => {
      if (messageType && typeReducer) {
        switch (typeReducer) {
          case 'create':
            return 'criado(a) com sucesso';
          case 'edit':
            return 'editado(a) com sucesso';
          case 'delete':
            return 'excluído(a) com sucesso';
          default:
            return '';
        }
      }
    }, [messageType, typeReducer]);

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
          <li style={{ textTransform: 'capitalize' }}>
            {`${messageTypeSpecified} ${messageTypeSpecifiedComplement}`}
          </li>
        </ul>
      )}
    </Alert>
  );
}
