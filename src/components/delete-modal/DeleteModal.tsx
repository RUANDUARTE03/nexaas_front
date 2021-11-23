import { Modal } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'next-i18next';
import ButtonChameleon from '../Chameleon/button-chameleon';
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
  const { t } = useTranslation('delete-modal');

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={Styles.container}
    >
      <div
        className={Styles.content}
        data-testid="container-delete-modal"
      >
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
            label={t('notRemove')}
            icon={false}
            outline
            onClick={onClose}
            dataTestId="btn-action-close-modal"
          />
          <ButtonChameleon
            label={t('remove')}
            icon={false}
            negative
            onClick={onSubmit}
            dataTestId="btn-action-submit-modal"
          />
        </div>
      </div>
    </Modal>
  );
}
