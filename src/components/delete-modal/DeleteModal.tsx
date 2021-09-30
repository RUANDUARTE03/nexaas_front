import { Modal } from '@material-ui/core';
import React from 'react';
import ButtonChameleon from '../Chameleon/ButtonChameleon';
import Styles from './DeleteModal.module.scss';

type DeleteModalProps = {
  title: string;
  children: JSX.Element;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export default function DeleteModal({
  title,
  children,
  open,
  onClose,
  onSubmit,
}: DeleteModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className={Styles.container}
    >
      <div className={Styles.content}>
        <div className={Styles.header}>
          <p>{title}</p>
        </div>
        <div className={Styles.body}>
          <p>{children}</p>
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
            label="Excluir"
            icon={false}
            negative
            onClick={onSubmit}
          />
        </div>
      </div>
    </Modal>
  );
}
