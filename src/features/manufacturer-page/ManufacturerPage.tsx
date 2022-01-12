import React, { useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { reverse } from 'named-urls';
import CircularProgress from '@material-ui/core/CircularProgress';
import router from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { routes } from '../../utils/routes';
import ButtonChameleon from '../../components/Chameleon/button-chameleon';
import Styles from './ManufacturerPage.module.scss';
import HeaderMenu from '../header-menu';
import Content from '../../components/content';
import { ALL_MANUFACTURERS } from '../../graphql/queries/manufacturers';
import ListingTable from '../../components/listing-table/ListingTable';

export default function ManufacturerPage() {
  const { t } = useTranslation('manufacturer');
  const { data, loading, refetch } = useQuery(
    ALL_MANUFACTURERS
  );

  const tableData = useMemo(
    () => (data ? data.manufacturers : []),
    [data]
  );

  const columns = useMemo(
    () => [
      {
        Header: t('table.nameColumn'),
        accessor: 'name',
      },
      {
        Header: t('table.actionsColumn'),
        accessor: 'actions',
        Cell: ({ row }) => {
          const manufacturer = row.original;
          const { id } = manufacturer || null;

          return (
            <div className={Styles.actionButton}>
              <div className={Styles.editButton}>
                <Link
                  href={reverse(
                    `${routes.manufacturers.edit}`,
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
        <div className={Styles.manufacturerPage}>
          <div className={Styles.header}>
            <ButtonChameleon
              dataTestId="btn-create-manufacturer"
              label={t('newManufacturerBtn')}
              primary
              icon
              onClick={() => {
                router.push(
                  routes.manufacturers.create.index
                );
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
