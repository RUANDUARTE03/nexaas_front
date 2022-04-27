/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable prefer-destructuring */
import { useMutation, useQuery } from '@apollo/client';
import { reverse } from 'named-urls';
import Link from 'next/link';

import React, { useMemo, useState } from 'react';
import router from 'next/router';
import { CircularProgress } from '@material-ui/core';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import AlertCustom from '../../components/alert';
import ButtonChameleon from '../../components/Chameleon/button-chameleon';
import ListingTable from '../../components/listing-table/ListingTable';
import {
  ALL_ORGANIZATION,
  DELETE_ORGANIZATION,
} from '../../graphql/queries/users';
import { routes } from '../../utils/routes';
import Styles from './UserPage.module.scss';
import HeaderMenu from '../header-menu';
import DeleteModal from '../../components/delete-modal';
import Content from '../../components/content';
import {
  clearSubmit,
  submitUsers,
} from '../../store/actions/submitUsers';
import { IErrorsGraphql } from '../brands-page/dtos';

type UserType = {
  id: number;
  name: string;
};

export default function UserPage() {
  const dispatch = useDispatch();
  const { type } = useSelector(
    (state) => state.SubmitUsers
  );
  const { t } = useTranslation('user');
  const [errors, setErrors] = useState<IErrorsGraphql[]>();
  const [deleteModalOpen, setDeleteModalOpen] =
    useState<boolean>(false);
  const [selectedUser, setSelectedUser] =
    useState<UserType>();
  const { data, loading, refetch } = useQuery(
    ALL_ORGANIZATION
  );

  const tableData = useMemo(
    () => (data ? data.users : []),
    [data]
  );

  const columns = useMemo(() => {
    return [
      {
        Header: t('table.nameColumn'),
        accessor: 'name',
      },
      {
        Header: t('table.emailColumn'),
        accessor: 'email',
      },
      {
        Header: t('table.roleColumn'),
        accessor: 'role',
        Cell: ({ row }) => {
          return (
            <>
              {row.original.role === 'admin'
                ? t('admin')
                : t('member')}
            </>
          );
        },
      },
      {
        Header: t('table.actionsColumn'),
        accessor: 'actions',
        Cell: ({ row }) => {
          const user = row.original;
          const { id } = user || null;

          return (
            <div className={Styles.actionButton}>
              <div className={Styles.editButton}>
                <Link
                  href={reverse(`${routes.users.edit}`, {
                    id,
                  })}
                >
                  <ButtonChameleon
                    label={t('editLabel')}
                    primary
                    outline
                    icon={false}
                    onClick={() => {
                      router.push(
                        routes.users.create.index
                      );
                    }}
                  />
                </Link>
              </div>

              <ButtonChameleon
                dataTestId="btn-delete-user"
                label={t('deleteLabel')}
                negative
                outline
                icon={false}
                onClick={() => {
                  router.push(routes.users.create.index);
                }}
              />
            </div>
          );
        },
      },
    ];
  }, [t]);

  const [deleteUser] = useMutation(DELETE_ORGANIZATION, {
    onCompleted: (response) => {
      const res = response.deleteUser;
      const errorsDelete: IErrorsGraphql[] | [] =
        res.errors;
      const success: boolean = res.success;

      if (success) {
        dispatch(submitUsers({ type: 'delete' }));
        setTimeout(() => {
          refetch();
        }, 1000);
      } else {
        setErrors(errorsDelete);
      }
      setDeleteModalOpen(false);
    },
  });

  const modalView = () => (
    <DeleteModal
      open={deleteModalOpen}
      onClose={onCloseModalDelete}
      onSubmit={confirmDeleteUser}
      title={t('removeUserLabel')}
    >
      <div>
        <span>
          {t('confirmRemoveUserLabel')}
          &nbsp;
          <b>{selectedUser?.name}</b>
          &nbsp;
          {`${'?'}`}
        </span>
      </div>
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

  const confirmDeleteUser = () => {
    deleteUser({
      variables: { input: { id: selectedUser.id } },
    });
  };

  function onCloseModalDelete(): void {
    setDeleteModalOpen(false);
    setSelectedUser(null);
  }

  return (
    <>
      <HeaderMenu breadcumb={[{ text: t('breadcumb') }]} />
      <Content>
        <div className={Styles.userPage}>
          <div className={Styles.header}>
            <ButtonChameleon
              dataTestId="btn-create-user"
              label={t('newUserBtn')}
              primary
              icon
              onClick={() => {
                router.push(routes.users.create.index);
              }}
            />
          </div>
          {errors ||
            (type !== '' && (
              <AlertCustom
                type={type !== '' ? 'success' : 'error'}
                errors={errors}
                messageType="user"
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
              hidePagination={false}
            />
          </div>
          {modalView()}
        </div>
      </Content>
    </>
  );
}
