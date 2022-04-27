/* eslint-disable react/jsx-curly-newline */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-destructuring */
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import CircularProgress from '@material-ui/core/CircularProgress';
import { submitManufacturers } from 'src/store/actions/submitManufacturers';
import AlertCustom from '../../../components/alert';
import { IErrorsGraphql } from '../../brands-page/dtos';
import Styles from './createEditManufacturer.module.scss';
import HeaderMenu from '../../header-menu';
import InputChameleon from '../../../components/Chameleon/input-chameleon';
import { routes } from '../../../utils/routes';
import {
  CREATE_MANUFACTURER,
  GET_MANUFACTURER,
  UPDATE_MANUFACTURER,
} from '../../../graphql/queries/manufacturers';
import ButtonChameleon from '../../../components/Chameleon/button-chameleon';

export default function CreateEditManufacturer() {
  const { t } = useTranslation('create-edit-manufacturer');
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { type } = useSelector(
    (state) => state.SubmitManufacturer
  );
  const [showModalErrors, setShowModalErros] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<IErrorsGraphql[]>();
  const [nameManufacturers, setNameManufacturers] =
    useState<string>('');
  const [manufacturerId, setManufacturerId] =
    useState<number>(0);

  const resetForm = () => {
    setNameManufacturers('');
    setErrors([]);
  };

  // Init Logic For Create Manufacturer
  const [createmanufacturer] = useMutation(
    CREATE_MANUFACTURER,
    {
      onCompleted: (response) => {
        const res = response.createManufacturer;
        const errorsCreate: IErrorsGraphql[] = res.errors;
        const success: boolean = res.success;

        if (success) {
          dispatch(submitManufacturers({ type: 'create' }));
          router.push(routes.manufacturers.index);
          setShowModalErros(false);
        } else {
          setShowModalErros(true);
          setErrors(errorsCreate);
        }
      },
    }
  );

  const handleSubmitCreateManufacturers = () => {
    createmanufacturer({
      variables: {
        input: {
          name: nameManufacturers,
        },
      },
    });
  };
  // Finish Logic For Create Manufacturer

  // Init Logic For Edit Manufacturer
  const {
    loading: loadingGetManufacturer,
    error: errorsGetManufacturer,
    data: dataGet,
  } = useQuery(GET_MANUFACTURER, { variables: { id } });

  useEffect(() => {
    if (dataGet && dataGet.manufacturer) {
      setNameManufacturers(dataGet.manufacturer.name);
    }
  }, [dataGet]);

  const [updatemanufacturer] = useMutation(
    UPDATE_MANUFACTURER,
    {
      onCompleted: (response) => {
        const res = response.updateManufacturer;
        const errorsEdit: IErrorsGraphql[] = res.errors;
        const success: boolean = res.success;

        if (success) {
          dispatch(submitManufacturers({ type: 'edit' }));
          router.push(routes.manufacturers.index);
          setShowModalErros(false);
        } else {
          setShowModalErros(true);
          setErrors(errorsEdit);
        }
      },
    }
  );

  const handleSubmitEditManufacturers = () => {
    updatemanufacturer({
      variables: {
        input: {
          id,
          name: nameManufacturers,
        },
      },
    });
  };
  // Finish Logic For Edit Manufacturer

  const showModalErrorsV2 = useMemo(() => {
    if (errors) {
      if (errors.length > 0) {
        return true;
      }
    }

    return false;
  }, [errors]);

  // only get Manufacturer
  if (errorsGetManufacturer && id) {
    return (
      <div data-testid="container-error-data">
        <h1>{t('error')}</h1>
      </div>
    );
  }

  if (loadingGetManufacturer) {
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
            text: t('Fabricantes'),
            click: () => {
              router.push(routes.manufacturers.index);
              resetForm();
            },
          },
          { text: id ? t('editLabel') : t('newLabel') },
        ]}
      />
      <div
        className={Styles.containerForm}
        data-testid="container-createOrEditManufacturer"
      >
        <h1 className="ch-spaceStack">
          {id
            ? t('editManufacturer')
            : t('newManufacturer')}
        </h1>
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

        <div className={Styles.card}>
          <InputChameleon
            label={t('name')}
            required
            value={manufacturerId}
            onChange={(e) => {
              setNameManufacturers(e.target.value);
            }}
            mode="text"
            dataCy="manufacturer"
            labelV2="manufacturerId"
            errors={errors}
            setErrors={(errorsFilter: IErrorsGraphql[]) =>
              setErrors(errorsFilter)
            }
          />
        </div>
        <div
          className="ch-spaceInlineGroup--s"
          style={{ marginTop: '1rem' }}
        >
          <ButtonChameleon
            dataTestId="btn-createOrEditManufacturer"
            label={id ? t('editSubmit') : t('createSubmit')}
            primary
            icon={false}
            onClick={
              id
                ? handleSubmitEditManufacturers
                : handleSubmitCreateManufacturers
            }
          />
          <ButtonChameleon
            dataTestId="btn-createOrEditManufacturer-cancel"
            label={t('cancel')}
            outline
            icon={false}
            onClick={() => {
              router.push(routes.manufacturers.index);
              resetForm();
            }}
          />
        </div>
      </div>
    </>
  );
}
