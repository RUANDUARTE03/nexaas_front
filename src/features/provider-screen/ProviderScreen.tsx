import React, { useState, useEffect } from 'react';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { useQuery, useMutation } from '@apollo/client';
import { reverse } from 'named-urls';
import CircularProgress from '@material-ui/core/CircularProgress';
import router from 'next/router';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '@material-ui/lab/Alert';
import { useTranslation } from 'next-i18next';
import { routes } from '../../utils/routes';
import ButtonChameleon from '../../components/Chameleon/button-chameleon';
import Styles from './ProviderScreen.module.scss';
import {
  ALL_PROVIDERS,
  DELETE_PROVIDER,
} from '../../graphql/queries/providers';
import {
  clearSubmit,
  submitProvider,
} from '../../store/actions/submitProviders';
import DeleteModal from '../../components/delete-modal';
import HeaderMenu from '../header-menu';
import Content from '../../components/content';

export default function ProviderScreen() {
  const dispatch = useDispatch();
  const { type } = useSelector(
    (state) => state.SubmitProvider
  );
  const [modalDeleteOpen, setModalDeleteOpen] =
    useState<boolean>(false);
  const [providerSelected, setProviderSelected] =
    useState(undefined);
  const { t } = useTranslation('provider');

  const { data, loading, refetch } =
    useQuery(ALL_PROVIDERS);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [deleteProvider] = useMutation(DELETE_PROVIDER, {
    onCompleted: (response) => {
      const { errors, success } = response.deleteProvider;

      if (errors === null && success) {
        setModalDeleteOpen(false);
        dispatch(submitProvider({ type: 'delete' }));
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
      title={t('removeProviderLabel')}
      open={modalDeleteOpen}
      onClose={discardModalDelete}
      onSubmit={confirmDeleteProvider}
    >
      <>
        {t('confirmRemoveProviderLabel')}
        &nbsp;
        <b>{providerSelected?.name}</b>
        &nbsp;
        {`${'?'}`}
      </>
    </DeleteModal>
  );

  if (loading)
    return (
      <div
        className="containerLoading"
        data-testid="container-loading-data"
      >
        <CircularProgress />
      </div>
    );

  return (
    <>
      <HeaderMenu breadcumb={[{ text: t('breadcumb') }]} />
      <Content>
        <>
          <div className="ch-spaceInlineGroup--right ch-spaceStack">
            <ButtonChameleon
              dataTestId="btn-create-provider"
              label={t('providerLabel')}
              primary
              icon
              onClick={() => {
                router.push(routes.providers.create.index);
              }}
            />
          </div>

          {type !== '' && (
            <Alert
              className={Styles.alert}
              severity="success"
              onClose={() => {
                dispatch(clearSubmit());
              }}
            >
              {`Fornecedor ${
                type === 'create'
                  ? t('createdLabel')
                  : type === 'edit'
                  ? t('editedLabel')
                  : t('deleteLabel')
              } com sucesso`}
            </Alert>
          )}
          <table className={`ch-table ${Styles.chTable}`}>
            <thead>
              <tr>
                <th>{t('docLabel')}</th>
                <th>{t('companyNameLabel')}</th>
                <th>{t('fantasyNameLabel')}</th>
                <th>{t('providerTypeLabel')}</th>
                <th>{t('actionsLabel')}</th>
              </tr>
            </thead>
            <tbody>
              {data?.providers?.map((provider) => (
                <tr
                  id={provider.id}
                  key={provider.id}
                  data-cy={provider.document}
                >
                  <td>
                    {provider.document.length === 11
                      ? cpf.format(provider.document)
                      : cnpj.format(provider.document)}
                  </td>
                  <td>{provider.name}</td>
                  <td>{provider.tradingName}</td>
                  <td>
                    {t(`provider.${provider.providerType}`)}
                  </td>
                  <td className="three wide">
                    <div className="ch-spaceInlineGroup--s">
                      <Link
                        href={reverse(
                          `${routes.providers.edit}`,
                          { id: provider.id }
                        )}
                      >
                        <ButtonChameleon
                          label={t('editLabel')}
                          primary
                          outline
                          icon={false}
                          onClick={() => {}}
                          dataTestId="btn-edit-provider"
                          dataCy={`btn-edit-provider-${provider.document}`}
                        />
                      </Link>
                      <ButtonChameleon
                        dataTestId="btn-delete-provider"
                        dataCy={`btn-delete-provider-${provider.document}`}
                        label={t('removeLabel')}
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
      </Content>
    </>
  );
}
