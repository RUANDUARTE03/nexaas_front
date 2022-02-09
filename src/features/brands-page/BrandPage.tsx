import React, { useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
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
import { ALL_BRANDS } from '../../graphql/queries/brands';

export default function BrandPage() {
  const { t } = useTranslation('brand');
  const { data, loading, refetch } = useQuery(ALL_BRANDS);

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
          const { id } = brand || null;

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
                  />
                </Link>
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

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
          </div>
        </div>
      </Content>
    </>
  );
}
