/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable prefer-destructuring */
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Router, useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { concat, remove } from 'lodash';
import { CREATE_ORGANIZATION } from 'src/graphql/queries/organizations';
import CircularProgress from '@material-ui/core/CircularProgress';
import AlertCustom from '../../../components/alert';
import { IErrorsGraphql } from '../../brands-page/dtos';
import Styles from './CreateEditUser.module.scss';
import HeaderMenu from '../../header-menu';
import InputChameleon from '../../../components/Chameleon/input-chameleon';
import ButtonChameleon from '../../../components/Chameleon/button-chameleon';
import Content from '../../../components/content';
import {
  ALL_ORGANIZATION,
  GET_USER,
  UPDATE_ORGANIZATION,
} from '../../../graphql/queries/users';
import { Organization } from '../../organization-page/models/Organization';
import CheckboxSelect from '../../../components/select';
import { routes } from '../../../utils/routes';
import { submitUsers } from '../../../store/actions/submitUsers';

/* eslint-disable array-callback-return */
type storeProps = {
  id: number;
  name: string;
};
interface FetchOrganizationData {
  organizations: Organization[];
}

export default function CreateEditUser() {
  const dispatch = useDispatch();
  const { t } = useTranslation('create-edit-user');
  const [errors, setErrors] = useState<IErrorsGraphql[]>();
  const router = useRouter();
  const { id } = router.query;
  const { type } = useSelector(
    (state) => state.SubmitUsers
  );
  const [showModalErrors, setShowModalErros] =
    useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [organizationSelected, setOrganizationSelected] =
    useState<number[]>([]);
  const [useStore, setUseStore] = useState<boolean>();

  const [customerStoreChannels, setcustomerStoreChannels] =
    useState<storeProps[] | undefined>();
  const [aquisitionStore, setstores] = useState<
    storeProps[] | undefined
  >();

  const { data: dataOrganizations } =
    useQuery<FetchOrganizationData>(ALL_ORGANIZATION);

  const onChangeEmail = (e: any) => {
    const ev = e.target.value;
    setEmail(ev);
  };

  // Init Logic For Create User
  const [createUsers] = useMutation(CREATE_ORGANIZATION, {
    onCompleted: (response) => {
      const res = response.createUsers;
      const errorsCreate: IErrorsGraphql[] = res.errors;
      const success: boolean = res.success;

      if (success) {
        dispatch(submitUsers({ type: 'create' }));
        router.push(routes.users.index);
        setShowModalErros(false);
      } else {
        setShowModalErros(true);
        setErrors(errorsCreate);
      }
    },
  });
  const handleSubmitCreateUsers = () => {
    if (!role || !email) {
      setErrors([
        {
          code: 'blank',
          message: 'Email não pode ficar em branco',
          path: ['Email'],
        },
        {
          code: 'blank',
          message:
            'Perfil de acesso não pode ficar em branco',
          path: ['Role'],
        },
      ]);

      setShowModalErros(true);
    } else {
      createUsers({
        variables: {
          input: {
            email,
            role: role === 'Membro' ? 'member' : 'admin',
            organizationIds: organizationSelected,
          },
        },
      });
    }
  };
  // Finish Logic For Create User

  // Init Logic For Edit User
  const {
    loading: loadingGetUser,
    data: dataGetUser,
    error: errorGetUser,
  } = useQuery(GET_USER, { variables: { id } });

  useEffect(() => {
    if (dataGetUser && dataGetUser.users) {
      setEmail(dataGetUser.users.email);
      setRole(
        dataGetUser.users.role === 'member'
          ? 'Membro'
          : 'Administrador'
      );
      setOrganizationSelected(
        dataGetUser.users.organizationIds
      );
    }
  }, [dataGetUser]);

  const [updateUser] = useMutation(UPDATE_ORGANIZATION, {
    onCompleted: (response) => {
      const res = response.updateUsers;
      const errorsEdit: IErrorsGraphql[] = res.errors;
      const success: boolean = res.success;

      if (success) {
        dispatch(submitUsers({ type: 'edit' }));
        router.push(routes.users.index);
        setShowModalErros(false);
      } else {
        setShowModalErros(true);
        setErrors(errorsEdit);
      }
    },
  });

  const handleSubmitEditUsers = () => {
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
  const onChangeChannel = (channel: storeProps) => {
    const checkIsActive =
      customerStoreChannels.includes(channel);
    if (checkIsActive) {
      const removeChannel = customerStoreChannels.filter(
        (cha) => cha.id !== channel.id
      );
      setcustomerStoreChannels(removeChannel);
    } else {
      const joined = [];
      customerStoreChannels?.map((chan) =>
        joined.push(chan)
      );
      joined.push(channel);
      setcustomerStoreChannels(joined);
    }
  };

  const showModalErrorsV2 = useMemo(() => {
    if (errors) {
      if (errors.length > 0) {
        return true;
      }
    }

    return false;
  }, [errors]);

  const changeOrganizationSelected = (orgID: number) => {
    if (
      !organizationSelected.find((osf) => orgID === osf)
    ) {
      const concatOrganization = concat(
        organizationSelected,
        orgID
      );
      setOrganizationSelected(concatOrganization);
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

          {errors && showModalErrors && showModalErrorsV2 && (
            <AlertCustom
              type="error"
              typeReducer={type}
              errors={errors}
              onClose={() => {
                setShowModalErros(false);
              }}
            />
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
                  dataCy="Email"
                  labelV2="Email"
                  errors={errors}
                  setErrors={(
                    errorsFilter: IErrorsGraphql[]
                  ) => setErrors(errorsFilter)}
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
                dataCy="Role"
                labelV2="Role"
                errors={errors}
                setErrors={(
                  errorsFilter: IErrorsGraphql[]
                ) => setErrors(errorsFilter)}
              />
            </div>
          </div>

          <div>
            <h2 className="ch-title ch-title--5">
              {t('providers')}
            </h2>

            <div
              className="ch-spaceInlineGroup--s"
              style={{ marginTop: '1rem' }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useStore}
                    onChange={(e) =>
                      setUseStore(e.target.checked)
                    }
                    color="primary"
                  />
                }
                label={t('Store 1')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useStore}
                    onChange={(e) =>
                      setUseStore(e.target.checked)
                    }
                    color="primary"
                  />
                }
                label={t('Store 2')}
              />
            </div>
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
                  ? handleSubmitEditUsers
                  : handleSubmitCreateUsers
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
