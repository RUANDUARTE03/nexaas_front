import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Styles from './modalDelete.module.scss';

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
        <Typography variant="h6">
          Excluir Fornecedor
        </Typography>
      </div>
      <Divider />
      <div className={Styles.body}>
        <Typography variant="subtitle1">
          Tem certeza que deseja excluir o fornecedor
          <b>{companyName}</b>
        </Typography>
      </div>
      <Divider />
      <div className={Styles.footer}>
        <Button onClick={onClose}>Não Excluir</Button>
        <Button onClick={onSubmit}>
          Excluir Fornecedor
        </Button>
      </div>
    </div>
  );
}
