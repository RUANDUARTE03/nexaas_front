import React, { useState, useEffect } from 'react';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Alert from '@material-ui/lab/Alert';
import { useDispatch } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonChameleon from '../../../components/Chameleon/button-chameleon';
import Styles from './createEditManufacturer.module.scss';
import {
  CREATE_MANUFACTURER,
  GET_MANUFACTURER,
  UPDATE_MANUFACTURER,
} from '../../../graphql/queries/manufacturers';
import { submitManufacturer } from '../../../store/actions/submitManufacturer';
import HeaderMenu from '../../header-menu';
import { routes } from '../../../utils/routes';
import InputChameleon from '../../../components/Chameleon/input-chameleon';

export default function CreateEditManufacturer() {
  const { t } = useTranslation('create-edit-manufacturer');
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const [errors, setErrors] = useState([]);

  const [nameManufacturers, setNameManufacturers] =
    useState<string>('');

  const resetForm = () => {
    setNameManufacturers('');
    setErrors([]);
  };

  // Init Logic For Create Manufacturer
  const [createmanufacturer] = useMutation(
    CREATE_MANUFACTURER,
    {
      onCompleted: (response) => {
        const { errors: errorsCreate } =
          response.createManufacturer;

        if (!errorsCreate.length) {
          dispatch(submitManufacturer({ type: 'create' }));
          router.push(routes.manufacturers.index);
        } else {
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
        const { errors: errorsEdit } =
          response.updateManufacturer;

        if (!errorsEdit.length) {
          dispatch(submitManufacturer({ type: 'edit' }));
          router.push(routes.manufacturers.index);
        } else {
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
        {errors.length > 0 && (
          <Alert severity="error">
            <AlertTitle>
              {`Erro ao ${
                id ? t('editLabel') : t('createLabel')
              } fabricante.`}
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

        <div className={Styles.card}>
          <InputChameleon
            label={t('name')}
            required
            value={nameManufacturers}
            onChange={(e) => {
              setNameManufacturers(e.target.value);
            }}
            mode="text"
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
