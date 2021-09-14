import React from 'react';
import ButtonChameleon from '../Chameleon/ButtonChameleon';
import Styles from './modalDelete.module.scss';

/* eslint-disable react/jsx-one-expression-per-line */
type ModalDeleteProps = {
  companyName: string;
  onClose: () => void;
  onSubmit: () => void;
};

export default function ModalDelete({
  companyName,
  onClose,
  onSubmit,
}: ModalDeleteProps) {
  return (
    <div className={Styles.container}>
      <div className={Styles.header}>
        <p>Excluir Fornecedor</p>
      </div>
      <div className={Styles.body}>
        <p>
          Tem certeza que deseja excluir o fornecedor{' '}
          <b>{companyName}</b>
        </p>
      </div>
      <div
        className={`actions ch-spaceInlineGroup--sRight ${Styles.footer}`}
      >
        <ButtonChameleon
          label="Não excluir"
          icon={false}
          outline
          onClick={onClose}
        />
        <ButtonChameleon
          label="Excluir fornecedor"
          icon={false}
          negative
          onClick={onSubmit}
        />
      </div>
    </div>
  );
}
