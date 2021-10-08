import React, { useState, useEffect } from 'react';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { useQuery, useMutation } from '@apollo/client';
import { reverse } from 'named-urls';
import CircularProgress from '@material-ui/core/CircularProgress';
import router from 'next/router';
import Link from 'next/link';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '@material-ui/lab/Alert';
import { routes } from '../../utils/routes';
import ButtonChameleon from '../../components/Chameleon/ButtonChameleon';
import Styles from './providerScreen.module.scss';
import {
  ALL_PROVIDERS,
  DELETE_PROVIDER,
} from '../../graphql/queries/providers';
import { clearSubmit } from '../../store/actions/submitProviders';
import DeleteModal from '../../components/delete-modal';

export default function ProviderScreen() {
  const dispatch = useDispatch();
  const { type } = useSelector(
    (state) => state.SubmitProvider
  );
  const [modalDeleteOpen, setModalDeleteOpen] =
    useState<boolean>(false);
  const [providerSelected, setProviderSelected] =
    useState(undefined);

  const { data, loading, refetch } =
    useQuery(ALL_PROVIDERS);

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
    <DeleteModal
      title="Remover fornecedor"
      open={modalDeleteOpen}
      onClose={discardModalDelete}
      onSubmit={confirmDeleteProvider}
    >
      <>
        Tem certeza que deseja excluir o fornecedor
        <b>{providerSelected?.name}</b> ?
      </>
    </DeleteModal>
  );

  if (loading) return <CircularProgress />;

  return (
    <>
      <div className="ch-spaceInlineGroup--right ch-spaceStack">
        <ButtonChameleon
          label="Fornecedores"
          primary
          icon
          onClick={() => {
            router.push(routes.providers.create.index);
          }}
        />
      </div>
      <FormControl variant="outlined">
        <InputLabel htmlFor="component-outlined">
          Name
        </InputLabel>
        <OutlinedInput
          id="component-outlined"
          label="Name"
        />
      </FormControl>
      {type !== '' && (
        <Alert
          className={Styles.alert}
          severity="success"
          onClose={() => {
            dispatch(clearSubmit());
          }}
        >
          {`Fornecedor ${
            type === 'create' ? 'criado' : 'editado'
          } com sucesso`}
        </Alert>
      )}
      <table className="ch-table">
        <thead>
          <tr>
            <th>CNPJ/CPF</th>
            <th>Razão Social/Nome</th>
            <th>Nome Fantasia</th>
            <th>Tipo de Fonecedores</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.providers.map((provider) => (
            <tr id={provider.id}>
              <td>
                {provider.document.length === 11
                  ? cpf.format(provider.document)
                  : cnpj.format(provider.document)}
              </td>
              <td>{provider.name}</td>
              <td>{provider.tradingName}</td>
              <td>{provider.providerType}</td>
              <td className="three wide">
                <div className="ch-spaceInlineGroup--s">
                  <Link
                    href={reverse(
                      `${routes.providers.edit}`,
                      { id: provider.id }
                    )}
                  >
                    <ButtonChameleon
                      label="Editar"
                      primary
                      outline
                      icon={false}
                      onClick={() => {}}
                    />
                  </Link>
                  <ButtonChameleon
                    label="Excluir"
                    negative
                    outline
                    icon={false}
                    onClick={() => {
                      setModalDeleteOpen(true);
                      setProviderSelected(provider);
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalView()}
    </>
  );
}
