/* eslint-disable react/jsx-wrap-multilines */
import { useMutation, useQuery } from '@apollo/client';
import { reverse } from 'named-urls';
import Link from 'next/link';
import { cnpj as cnpjFormatter } from 'cpf-cnpj-validator';

import React, { useEffect, useMemo, useState } from 'react';
import router from 'next/router';
import { CircularProgress } from '@material-ui/core';
import { useTranslation } from 'next-i18next';
import ButtonChameleon from '../../components/Chameleon/button-chameleon';
import ListingTable from '../../components/listing-table/ListingTable';
import {
  ALL_ORGANIZATIONS,
  DELETE_ORGANIZATION,
} from '../../graphql/queries/organizations';
import { routes } from '../../utils/routes';
import DeleteModal from '../../components/delete-modal';
import { Organization } from './models/Organization';
import Styles from './OrganizationPage.module.scss';
import { GET_CURRENT_ORGANIZATION } from '../../graphql/queries/session';
import HeaderMenu from '../header-menu';
import Content from '../../components/content';

interface FetchOrganizationData {
  organizations: Organization[];
}

export default function OrganizationPage() {
  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization>();
  const [currentOrg, setCurrentOrg] = useState<number>();

  const { data: dataGet } = useQuery(
    GET_CURRENT_ORGANIZATION
  );
  const { t } = useTranslation('organization');

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
          const { id } = organization || null;

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
                />
              )}
            </div>
          );
        },
      },
    ],
    [currentOrg]
  );

  function onCloseModalDelete(): void {
    setDeleteModalOpen(false);
    setSelectedOrganization(null);
  }

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
        </span>
      </div>
    </DeleteModal>
  );

  const [deleteOrganization] = useMutation(
    DELETE_ORGANIZATION,
    {
      onCompleted: (response) => {
        const { errors } = response.deleteOrganization;

        if (!errors.length) {
          setDeleteModalOpen(false);

          setTimeout(() => {
            refetch();
          }, 1000);
        }
      },
    }
  );

  const confirmDeleteOrganization = () => {
    deleteOrganization({
      variables: { input: { id: selectedOrganization.id } },
    });
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading)
    return (
      <div data-testid="container-loading-data">
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
          <div>
            <ListingTable
              data={tableData}
              columns={columns}
            />
            {modalView()}
          </div>
        </div>
      </Content>
    </>
  );
}
