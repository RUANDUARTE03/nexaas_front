import React, { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { reverse } from 'named-urls';
import CircularProgress from '@material-ui/core/CircularProgress';
import router from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { routes } from '../../utils/routes';
import ButtonChameleon from '../../components/Chameleon/button-chameleon';
import Styles from './BrandPage.module.scss';
import HeaderMenu from '../header-menu';
import Content from '../../components/content';
import ListingTable from '../../components/listing-table/ListingTable';
import {
  ALL_BRANDS,
  DELETE_BRAND,
} from '../../graphql/queries/brands';
import DeleteModal from '../../components/delete-modal';

type BrandType = {
  id: number;
  name: string;
  manufacturer: {
    id: number;
    name: string;
  };
};

export default function BrandPage() {
  const { t } = useTranslation('brand');
  const { data, loading, refetch } = useQuery(ALL_BRANDS);
  const [deleteModalOpen, setDeleteModalOpen] =
    useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] =
    useState<BrandType>();

  const tableData = useMemo(
    () => (data ? data.productBrands : []),
    [data]
  );

  const columns = useMemo(
    () => [
      {
        Header: t('table.nameColumn'),
        accessor: 'name',
      },
      {
        Header: t('table.manufacturerColumn'),
        accessor: 'manufacturer.name',
      },
      {
        Header: t('table.actionsColumn'),
        accessor: 'actions',
        Cell: ({ row }) => {
          const brand = row.original;
          const { id, name } = brand || null;

          return (
            <div className={Styles.actionButton}>
              <div className={Styles.editButton}>
                <Link
                  href={reverse(`${routes.brands.edit}`, {
                    id,
                  })}
                >
                  <ButtonChameleon
                    label={t('editLabel')}
                    primary
                    outline
                    icon={false}
                    onClick={() => {}}
                    dataCy={`btn-edit-brand-${name.replace(
                      ' ',
                      '-'
                    )}`}
                  />
                </Link>
              </div>
              <ButtonChameleon
                dataTestId="btn-delete-brand"
                label={t('deleteLabel')}
                negative
                outline
                icon={false}
                onClick={() => {
                  setDeleteModalOpen(true);
                  setSelectedBrand(brand);
                }}
                dataCy={`btn-edit-brand-${name.replace(
                  ' ',
                  '-'
                )}`}
              />
            </div>
          );
        },
      },
    ],
    [t]
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [deleteBrand] = useMutation(DELETE_BRAND, {
    onCompleted: (response) => {
      const { errors, success } =
        response.deleteProductBrand;

      if (errors === null && success) {
        setDeleteModalOpen(false);

        setTimeout(() => {
          refetch();
        }, 1000);
      }
    },
  });

  const modalView = () => (
    <DeleteModal
      open={deleteModalOpen}
      onClose={onCloseModalDelete}
      onSubmit={confirmDeleteBrand}
      title={t('removeBrandLabel')}
    >
      <div>
        <span>
          {t('confirmRemoveBrandLabel')}
          &nbsp;
          <b>{selectedBrand?.name}</b>
          &nbsp;
          {`${'?'}`}
        </span>
      </div>
    </DeleteModal>
  );

  const confirmDeleteBrand = () => {
    deleteBrand({
      variables: { input: { id: selectedBrand.id } },
    });
  };

  const onCloseModalDelete = () => {
    setDeleteModalOpen(false);
    setSelectedBrand(null);
  };

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
        <div className={Styles.brandPage}>
          <div className={Styles.header}>
            <ButtonChameleon
              dataTestId="btn-create-brand"
              label={t('newBrandBtn')}
              primary
              icon
              onClick={() => {
                router.push(routes.brands.create.index);
              }}
            />
          </div>
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
