/* eslint-disable react/jsx-wrap-multilines */
import { useMutation, useQuery } from '@apollo/client';
import { reverse } from 'named-urls';
import Link from 'next/link';
import { cnpj as cnpjFormatter } from 'cpf-cnpj-validator';

import React, { useEffect, useMemo, useState } from 'react';
import router from 'next/router';
import ButtonChameleon from '../../components/Chameleon/ButtonChameleon';
import ListingTable from '../../components/listing-table/ListingTable';
import {
  ALL_ORGANIZATIONS,
  DELETE_ORGANIZATION,
} from '../../graphql/queries/organizations';
import { routes } from '../../utils/routes';
import DeleteModal from '../../components/delete-modal';
import { Organization } from './models/Organization';
import Styles from './OrganizationPage.module.scss';
import { GET_SESSION_PROFILE } from '../../graphql/queries/session';

interface FetchOrganizationData {
  organizations: Organization[];
}

export default function OrganizationPage() {
  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization>();
  const [currentOrg, setCurrentOrg] = useState();

  const { data: dataGet } = useQuery(GET_SESSION_PROFILE);

  useEffect(() => {
    console.log('asdasd', dataGet);
    if (dataGet && dataGet.session) {
      console.log(dataGet.session);
    }
  }, [dataGet]);

  const { data, refetch } = useQuery<FetchOrganizationData>(
    ALL_ORGANIZATIONS
  );

  const columns = useMemo(() => {
    return [
      {
        title: 'Nome',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'CNPJ',
        dataIndex: 'cnpj',
        key: 'cnpj',
        render: (cnpj: string) => (
          <>{cnpjFormatter.format(cnpj)}</>
        ),
      },
      {
        title: 'Ações',
        key: 'actions',
        render: (organization: Organization) => {
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
                    label="Editar"
                    primary
                    outline
                    icon={false}
                    onClick={() => {}}
                  />
                </Link>
              </div>

              <ButtonChameleon
                label="Excluir"
                negative
                outline
                icon={false}
                onClick={() => {
                  setDeleteModalOpen(true);
                  setSelectedOrganization(organization);
                }}
              />
            </div>
          );
        },
      },
    ];
  }, [data]);

  function onCloseModalDelete(): void {
    setDeleteModalOpen(false);
    setSelectedOrganization(null);
  }

  const modalView = () => (
    <DeleteModal
      open={deleteModalOpen}
      onClose={onCloseModalDelete}
      onSubmit={confirmDeleteOrganization}
      title="Excluir organização"
    >
      <div>
        <span>
          Tem certeza que deseja excluir a organização
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

  return (
    <div className={Styles.organizationPage}>
      <div className={Styles.header}>
        <ButtonChameleon
          label="Organização"
          primary
          icon
          onClick={() => {
            router.push(routes.organizations.create.index);
          }}
        />
      </div>
      <div>
        <ListingTable
          data={data?.organizations}
          columns={columns}
        />
        {modalView()}
      </div>
    </div>
  );
}
