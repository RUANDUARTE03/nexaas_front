import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { concat, remove } from 'lodash';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Styles from './CreateEditUser.module.scss';
import HeaderMenu from '../../header-menu';
import InputChameleon from '../../../components/Chameleon/input-chameleon';
import ButtonChameleon from '../../../components/Chameleon/button-chameleon';
import CheckboxSelect from '../../../components/select';
import { ALL_ORGANIZATIONS } from '../../../graphql/queries/organizations';
import {
  CREATE_USER,
  GET_USER,
  UPDATE_ORGANIZATION,
} from '../../../graphql/queries/users';
import { Organization } from '../../organization-page/models/Organization';
import { routes } from '../../../utils/routes';
import { submitUser } from '../../../store/actions/submitUsers';
import Content from '../../../components/content';

/* eslint-disable array-callback-return */

interface FetchOrganizationData {
  organizations: Organization[];
}
export default function CreateEditUser() {
  const { t } = useTranslation('create-edit-user');

  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const [errors, setErrors] = useState([]);

  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [organizationSelected, setOrganizationSelected] =
    useState<number[]>([]);

  const { data: dataOrganization } =
    useQuery<FetchOrganizationData>(ALL_ORGANIZATIONS);

  const onChangeEmail = (e: any) => {
    const ev = e.target.value;
    setEmail(ev);
  };

  // Init Logic For Create User
  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: (response) => {
      const { errors: errorsCreate } = response.createUser;

      if (!errorsCreate.length) {
        dispatch(submitUser({ type: 'create' }));
        router.push(routes.users.index);
      } else {
        setErrors(errorsCreate);
      }
    },
  });

  const handleSubmitCreateUser = () => {
    createUser({
      variables: {
        input: {
          email,
          role: role === 'Membro' ? 'member' : 'admin',
          organizationIds: organizationSelected,
        },
      },
    });
  };
  // Finish Logic For Create User

  // Init Logic For Edit User
  const {
    loading: loadingGetUser,
    data: dataGetUser,
    error: errorGetUser,
  } = useQuery(GET_USER, { variables: { id } });

  useEffect(() => {
    if (dataGetUser && dataGetUser.user) {
      setEmail(dataGetUser.user.email);
      setRole(
        dataGetUser.user.role === 'member'
          ? 'Membro'
          : 'Administrador'
      );
      setOrganizationSelected(
        dataGetUser.user.organizationIds
      );
    }
  }, [dataGetUser]);

  const [updateUser] = useMutation(UPDATE_ORGANIZATION, {
    onCompleted: (response) => {
      const { errors: errorsEdit } = response.updateUser;

      if (!errorsEdit.length) {
        dispatch(submitUser({ type: 'edit' }));
        router.push(routes.users.index);
      } else {
        setErrors(errorsEdit);
      }
    },
  });

  const handleSubmitEditUser = () => {
    updateUser({
      variables: {
        input: {
          id,
          email,
          role: role === 'Membro' ? 'member' : 'admin',
          organizationIds: organizationSelected,
        },
      },
    });
  };
  // Finish Logic For Edit User

  const changeOrganizationsSelected = (orgID: number) => {
    if (
      !organizationSelected.find((osf) => orgID === osf)
    ) {
      const concatOrganizations = concat(
        organizationSelected,
        orgID
      );
      setOrganizationSelected(concatOrganizations);
    } else {
      setOrganizationSelected(
        organizationSelected.filter((n) => n !== orgID)
      );
    }
  };

  const resetForm = () => {
    setEmail('');
    setRole('');
    setOrganizationSelected([]);
  };

  if (errorGetUser && id) {
    return (
      <div data-testid="container-error-data">
        <h1>{t('error')}</h1>
      </div>
    );
  }

  if (loadingGetUser) {
    return (
      <div
        className="containerLoading"
        data-testid="container-loading-data"
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <HeaderMenu
        breadcumb={[
          {
            text: t('breadcumb'),
            click: () => {
              router.push(routes.users.index);
              resetForm();
            },
          },
          { text: id ? t('editUser') : t('createUser') },
        ]}
      />
      <Content>
        <div
          className={Styles.containerForm}
          data-testid="container-createOrEdit-user"
        >
          {!id && (
            <h1 className="ch-spaceStack">
              {`${t('createUser')} Usuário`}
            </h1>
          )}

          {errors.length > 0 && (
            <Alert severity="error">
              <AlertTitle>
                {`Erro ao ${
                  id ? t('editUser') : t('createUser')
                } usuário.`}
              </AlertTitle>
              {errors.map((x) => {
                return (
                  <ul>
                    <li>{x}</li>
                  </ul>
                );
              })}
            </Alert>
          )}

          {id && (
            <Typography
              variant="h4"
              style={{ fontWeight: 700 }}
            >
              {email}
            </Typography>
          )}

          <div
            className={`${Styles.wrapperIptRow} ${Styles.wrapperIptFirst}`}
          >
            {!id && (
              <div className={Styles.wrapperIpt}>
                <InputChameleon
                  label={t('email')}
                  required
                  value={email}
                  onChange={(e) => onChangeEmail(e)}
                  mode="text"
                />
              </div>
            )}

            <div className={Styles.wrapperIptSM}>
              <InputChameleon
                label={t('accessProfile')}
                value={role}
                onChange={(e) => {
                  setRole(e.target.value.toString());
                }}
                mode="select"
                options={[
                  {
                    value: 'Membro',
                    label: 'Membro',
                  },
                  {
                    value: 'Administrador',
                    label: 'Administrador',
                  },
                ]}
              />
            </div>
          </div>

          <div
            className="ch-spaceStackGroup--s"
            style={{ marginTop: '2rem' }}
          >
            <h2 className="ch-title ch-title--5">
              {t('providers')}
            </h2>
          </div>

          <div className={Styles.bodyChecked}>
            {dataOrganization?.organizations.map(
              (org, index) => {
                return (
                  <div key={index}>
                    <CheckboxSelect
                      title={org.name}
                      checked={
                        !!organizationSelected.find(
                          (osf) =>
                            Number(org.id) === Number(osf)
                        )
                      }
                      onChecked={(e) => {
                        changeOrganizationsSelected(
                          Number(org.id)
                        );
                      }}
                    />
                  </div>
                );
              }
            )}
          </div>

          <div
            className="ch-spaceInlineGroup--s"
            style={{ marginTop: '2rem' }}
          >
            <ButtonChameleon
              dataTestId="btn-createOrEditUser"
              label={`${
                id ? t('editUserBtn') : t('createUserBtn')
              } Usuário`}
              primary
              icon={false}
              onClick={
                id
                  ? handleSubmitEditUser
                  : handleSubmitCreateUser
              }
            />
            <ButtonChameleon
              dataTestId="btn-createOrEditUser-cancel"
              label={t('cancelLabel')}
              outline
              icon={false}
              onClick={() => {
                router.push(routes.users.index);
                resetForm();
              }}
            />
          </div>
        </div>
      </Content>
    </>
  );
}
