import React, { useState, useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { reverse } from 'named-urls';
import CircularProgress from '@material-ui/core/CircularProgress';
import Header from '../../components/header';
import Actions from '../../components/actionsHeader';
import ModalDelete from '../../components/modalDelete';
import { routes } from '../../utils/routes';

import Styles from './providerScreen.module.scss';
import { ALL_PROVIDERS, DELETE_PROVIDER } from '../../graphql/queries/providers';

export default function ProviderScreen() {
  const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);
  const [providerSelected, setProviderSelected] = useState(undefined);

  const { data, loading, refetch, error } = useQuery(ALL_PROVIDERS);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [deleteProvider] = useMutation(DELETE_PROVIDER, {
    onCompleted: (response) => {
      const { errors } = response.deleteProvider;

      if (!errors.length) {
        setModalDeleteOpen(false);
        setTimeout(() => {
          refetch();
        }, 1000);
      }
    },
  });

  const discardModalDelete = () => {
    setModalDeleteOpen(false);
    setProviderSelected(undefined);
  };

  const confirmDeleteProvider = () => {
    deleteProvider({
      variables: { input: { id: providerSelected.id } },
    });
  };

  const modalView = () => (
    <Modal open={modalDeleteOpen} onClose={discardModalDelete} className={Styles.containerModal}>
      <ModalDelete
        companyName={providerSelected?.companyName}
        onClose={discardModalDelete}
        onSubmit={confirmDeleteProvider}
      />
    </Modal>
  );

  if (loading) return <CircularProgress />;
  if (error) return <h1>Error</h1>;

  return (
    <div className={Styles.container}>
      <Header
        navigation={[
          {
            title: 'Fornecedores',
          },
        ]}
      />
      <Actions
        actions={[
          {
            label: 'Criar novo fornecedor',
            disabled: false,
            className: `${Styles.icon}`,
            icon: <AddIcon />,
            actionButton: routes.providers.create.index,
          },
        ]}
      />
      <TableContainer>
        <Table aria-label="customized table">
          <TableHead className={Styles.containerHeaderTable}>
            <TableRow>
              <TableCell>CPF/CNPJ</TableCell>
              <TableCell align="right">Razão Social/Nome</TableCell>
              <TableCell align="right">Nome Fantasia</TableCell>
              <TableCell align="right">Tipo de Fornecedor</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.providers.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell component="th" scope="row">
                  {provider.document}
                </TableCell>
                <TableCell align="right">{provider.name}</TableCell>
                <TableCell align="right">{provider.tradingName}</TableCell>
                <TableCell align="right">
                  {provider.providerType === 'carrier'
                    ? 'Operadora'
                    : provider.typeProvider === 'distributor'
                    ? 'Distribuidora'
                    : 'Fornecedora'}
                </TableCell>
                <TableCell align="right">
                  <Link href={reverse(`${routes.providers.edit}`, { id: provider.id })}>
                    <Button className={Styles.btnEdit}>Editar</Button>
                  </Link>
                  <Button
                    className={Styles.btnDelete}
                    onClick={() => {
                      setModalDeleteOpen(true);
                      setProviderSelected(provider);
                    }}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {modalView()}
    </div>
  );
}
