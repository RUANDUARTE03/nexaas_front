/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-destructuring */
import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { reverse } from 'named-urls';
import CircularProgress from '@material-ui/core/CircularProgress';
import router from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { routes } from '../../utils/routes';
import AlertCustom from '../../components/alert';
import DeleteModal from '../../components/delete-modal';
import HeaderMenu from '../header-menu';
import ButtonChameleon from '../../components/Chameleon/button-chameleon';
import Styles from './ManufacturerPage.module.scss';
import { IErrorsGraphql } from '../brands-page/dtos';
import Content from '../../components/content';
import ListingTable from '../../components/listing-table/ListingTable';
import {
  ALL_MANUFACTURERS,
  DELETE_MANUFACTURER,
} from '../../graphql/queries/manufacturers';
import {
  submitManufacturers,
  clearSubmit,
} from '../../store/actions/submitManufacturers';

type ManufacturerType = {
  id: number;
  name: string;
};

export default function ManufacturerPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation('Manufacturer');
  const { type } = useSelector(
    (state) => state.SubmitManufacturer
  );
  const { data, loading, refetch } = useQuery(
    ALL_MANUFACTURERS
  );
  const [errors, setErrors] = useState<IErrorsGraphql[]>();
  const [deleteModalOpen, setDeleteModalOpen] =
    useState<boolean>(false);
  const [selectedManufacturer, setSelectedManufacturer] =
    useState<ManufacturerType>();

  const tableData = useMemo(
    () => (data ? data.manufacturers : []),
    [data]
  );

  const columns = useMemo(
    () => [
      {
        Header: t('table.nameColumn'),
        accessor: 'name',
        Cell: (s) => (
          <span style={{ width: '80%' }}>{s.value}</span>
        ),
      },
      {
        Header: t('table.actionsColumn'),
        accessor: 'actions',
        style: {
          width: '400px',
        },
        Cell: ({ row }) => {
          const manufacturer = row.original;
          const { id, name } = manufacturer || null;

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
                    dataCy={`btn-edit-manufacturer-${name.replace(
                      ' ',
                      '-'
                    )}`}
                  />
                </Link>
              </div>

              <ButtonChameleon
                dataTestId="btn-delete-manufacturer"
                label={t('deleteLabel')}
                negative
                outline
                icon={false}
                onClick={() => {
                  setDeleteModalOpen(true);
                  setSelectedManufacturer(manufacturer);
                }}
                dataCy={`btn-delete-manufacturer-${name.replace(
                  ' ',
                  '-'
                )}`}
              />
            </div>
          );
        },
      },
    ],
    []
  );

  function onCloseModalDelete(): void {
    setDeleteModalOpen(false);
    setSelectedManufacturer(null);
  }

  const [deleteManufacturer] = useMutation(
    DELETE_MANUFACTURER,
    {
      onCompleted: (response) => {
        const res = response.deleteManufacturer;
        const errorsDelete: IErrorsGraphql[] | [] =
          res.errors;
        const success: boolean = res.success;

        if (success) {
          dispatch(submitManufacturers({ type: 'delete' }));
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

  const confirmDeleteManufacturer = () => {
    deleteManufacturer({
      variables: {
        input: {
          id: selectedManufacturer
            ? selectedManufacturer.id
            : null,
        },
      },
    });
  };

  const modalView = () => (
    <DeleteModal
      open={deleteModalOpen}
      onClose={onCloseModalDelete}
      onSubmit={confirmDeleteManufacturer}
      title={t('removeOrgLabel')}
    >
      <div>
        <span>
          {t('confirmRemoveOrgLabel')}
          &nbsp;
          <b>{selectedManufacturer?.name}</b>
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
          {errors ||
            (type !== '' && (
              <AlertCustom
                type={type !== '' ? 'success' : 'error'}
                errors={errors}
                messageType="manufacturer"
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
              borderedTable
            />
          </div>
        </div>
      </Content>
      {modalView()}
    </>
  );
}
