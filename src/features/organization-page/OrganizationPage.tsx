/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable prefer-destructuring */
import { useMutation, useQuery } from '@apollo/client';
import { reverse } from 'named-urls';
import Link from 'next/link';
import { cnpj as cnpjFormatter } from 'cpf-cnpj-validator';

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import router from 'next/router';
import { CircularProgress } from '@material-ui/core';
import { useTranslation } from 'next-i18next';
import AlertCustom from '../../components/alert';
import ButtonChameleon from '../../components/Chameleon/button-chameleon';
import ListingTable from '../../components/listing-table/ListingTable';
import {
  ALL_ORGANIZATIONS,
  DELETE_ORGANIZATION,
} from '../../graphql/queries/organizations';
import { routes } from '../../utils/routes';
import DeleteModal from '../../components/delete-modal';
import { Organization } from './models/Organization';
import Content from '../../components/content';
import HeaderMenu from '../header-menu';
import Styles from './OrganizationPage.module.scss';
import {
  clearSubmit,
  SubmitOrganizations,
} from '../../store/actions/submitOrganizations';
import { IErrorsGraphql } from '../brands-page/dtos';

interface FetchOrganizationData {
  organizations: Organization[];
}

interface OrganizationType {
  id: number;
  name: string;
}

export default function OrganizationPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation('organization');
  const { type } = useSelector(
    (state) => state.SubmitOrganizations
  );
  const { data: dataGet } = useQuery(ALL_ORGANIZATIONS);
  const [errors, setErrors] = useState<IErrorsGraphql[]>();
  const [currentOrg, setCurrentOrg] = useState<number>();
  const [deleteModalOpen, setDeleteModalOpen] =
    useState<boolean>(false);
  const [selectedOrganization, setSelectedOrganization] =
    useState<OrganizationType>();

  useEffect(() => {
    if (dataGet && dataGet.session) {
      dataGet.session.organizations.forEach((org) =>
        org.current ? setCurrentOrg(org.id) : null
      );
    }
  }, [dataGet]);

  const { data, refetch, loading } =
    useQuery<FetchOrganizationData>(ALL_ORGANIZATIONS);

  const tableData = React.useMemo(
    () => (data ? data.organizations : []),
    [data]
  );

  const columns = useMemo(
    () => [
      {
        Header: t('table.nameColumn'),
        accessor: 'name',
      },
      {
        Header: t('table.cnpjColumn'),
        accessor: 'cnpj',
        Cell: ({ value }) => (
          <>{cnpjFormatter.format(value)}</>
        ),
      },
      {
        Header: t('table.actionsColumn'),
        accessor: 'actions',
        Cell: ({ row }) => {
          const organization = row.original;
          const { id, name } = organization || null;

          return (
            <div className={Styles.actionButton}>
              <div className={Styles.editButton}>
                <Link
                  href={reverse(
                    `${routes.organizations.edit}`,
                    {
                      id,
                    }
                  )}
                >
                  <ButtonChameleon
                    label={t('editLabel')}
                    primary
                    outline
                    icon={false}
                    onClick={() => {}}
                    dataCy={`btn-edit-organization-${name.replace(
                      ' ',
                      '-'
                    )}`}
                  />
                </Link>
              </div>
              {Number(id) !== currentOrg && (
                <ButtonChameleon
                  dataTestId="btn-delete-organization"
                  label={t('deleteLabel')}
                  negative
                  outline
                  icon={false}
                  onClick={() => {
                    setDeleteModalOpen(true);
                    setSelectedOrganization(organization);
                  }}
                  dataCy={`btn-edit-organization-${name.replace(
                    ' ',
                    '-'
                  )}`}
                />
              )}
            </div>
          );
        },
      },
    ],
    [t]
  );

  function onCloseModalDelete(): void {
    setDeleteModalOpen(false);
    setSelectedOrganization(null);
  }

  const [deleteOrganization] = useMutation(
    DELETE_ORGANIZATION,
    {
      onCompleted: (response) => {
        const res = response.deleteOrganizations;
        const errorsDelete: IErrorsGraphql[] | [] =
          res.errors;
        const success: boolean = res.success;

        if (success) {
          dispatch(SubmitOrganizations({ type: 'delete' }));
          setTimeout(() => {
            refetch();
          }, 1000);
        } else {
          setErrors(errorsDelete);
        }
        setDeleteModalOpen(false);
      },
    }
  );
  const confirmDeleteOrganization = () => {
    deleteOrganization({
      variables: {
        input: {
          id: selectedOrganization
            ? selectedOrganization.id
            : null,
        },
      },
    });
  };

  const modalView = () => (
    <DeleteModal
      open={deleteModalOpen}
      onClose={onCloseModalDelete}
      onSubmit={confirmDeleteOrganization}
      title={t('removeOrgLabel')}
    >
      <div>
        <span>
          {t('confirmRemoveOrgLabel')}
          &nbsp;
          <b>{selectedOrganization?.name}</b>
          &nbsp;
          {`${'?'}`}
        </span>
      </div>
    </DeleteModal>
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

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
        <div className={Styles.organizationPage}>
          <div className={Styles.header}>
            <ButtonChameleon
              dataTestId="btn-create-organization"
              label={t('newOrganizationBtn')}
              primary
              icon
              onClick={() => {
                router.push(
                  routes.organizations.create.index
                );
              }}
            />
          </div>
          {errors ||
            (type !== '' && (
              <AlertCustom
                type={type !== '' ? 'success' : 'error'}
                errors={errors}
                messageType="organization"
                onClose={() => {
                  dispatch(clearSubmit());
                }}
                typeReducer={type}
              />
            ))}
          <div>
            <ListingTable
              data={tableData}
              columns={columns}
              hidePagination
            />
            {modalView()}
          </div>
        </div>
      </Content>
    </>
  );
}
