/* eslint-disable react/jsx-curly-newline */
/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable prefer-destructuring */
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'next-i18next';
import AlertCustom from '../../../components/alert';
import { IErrorsGraphql } from '../dtos';
import InputChameleon from '../../../components/Chameleon/input-chameleon';
import Styles from './CreateEditBrand.module.scss';
import { routes } from '../../../utils/routes';
import HeaderMenu from '../../header-menu';
import Content from '../../../components/content';
import {
  CREATE_BRAND,
  GET_BRAND,
  UPDATE_BRAND,
} from '../../../graphql/queries/brands';
import { submitBrand } from '../../../store/actions/submitBrands';
import ButtonChameleon from '../../../components/Chameleon/button-chameleon/ButtonChameleon';
import { ALL_MANUFACTURERS } from '../../../graphql/queries/manufacturers';

export default function CreateEditBrand() {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation('create-edit-brand');
  const dispatch = useDispatch();
  const { type } = useSelector(
    (state) => state.SubmitBrands
  );
  const [showModalErrors, setShowModalErros] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<IErrorsGraphql[]>();
  const [name, setName] = useState<string>('');
  const [manufacturerId, setManufacturerId] =
    useState<number>(0);

  const { data, loading } = useQuery(ALL_MANUFACTURERS);

  const [createBrand] = useMutation(CREATE_BRAND, {
    onCompleted: (response) => {
      const res = response.createProductBrand;
      const errorsCreate: IErrorsGraphql[] = res.errors;
      const success: boolean = res.success;

      if (success) {
        dispatch(submitBrand({ type: 'create' }));
        router.push(routes.brands.index);
        setShowModalErros(false);
      } else {
        setShowModalErros(true);
        setErrors(errorsCreate);
      }
    },
  });

  const {
    loading: loadingGetProductBrand,
    error: errorsGetProductBrand,
    data: dataGet,
  } = useQuery(GET_BRAND, { variables: { id } });

  useEffect(() => {
    if (dataGet && dataGet.productBrand) {
      const { productBrand } = dataGet;

      setName(productBrand.name);
      setManufacturerId(
        Number(productBrand?.manufacturer?.id)
      );
    }
  }, [dataGet]);

  function handleCancel(): void {
    router.push(routes.brands.index);
  }

  const handleCreateBrandSubmit = () => {
    createBrand({
      variables: {
        input: {
          name,
          manufacturerId,
        },
      },
    });
  };

  const [updateBrand] = useMutation(UPDATE_BRAND, {
    onCompleted: (response) => {
      const res = response.updateProductBrand;
      const errorsEdit: IErrorsGraphql[] = res.errors;
      const success: boolean = res.success;

      if (success) {
        dispatch(submitBrand({ type: 'edit' }));
        router.push(routes.brands.index);
        setShowModalErros(false);
      } else {
        setShowModalErros(true);
        setErrors(errorsEdit);
      }
    },
  });

  const handleUpdateBrandSubmit = () => {
    updateBrand({
      variables: {
        input: {
          id,
          name,
          manufacturerId,
        },
      },
    });
  };

  if (errorsGetProductBrand && id) {
    return (
      <div data-testid="container-error-data">
        <h1>{t('error')}</h1>
      </div>
    );
  }

  if (loadingGetProductBrand) {
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
              router.push(routes.brands.index);
            },
          },
          { text: id ? t('editLabel') : t('newLabel') },
        ]}
      />
      <Content>
        <div className={Styles.createEditBrand}>
          <h1 className="ch-spaceStack">
            {id ? t('editBrandLabel') : t('newBrandLabel')}
          </h1>

          {errors && showModalErrors && (
            <AlertCustom
              type="error"
              typeReducer={type}
              errors={errors}
              onClose={() => {
                setShowModalErros(false);
              }}
            />
          )}

          <div>
            <form className="simple_form ui form ch-spaceStackGroup--xl">
              <div className={Styles.uiSegment}>
                <div className={Styles.twoFields}>
                  <div className={Styles.field}>
                    <InputChameleon
                      label={t('nameLabel')}
                      required
                      value={name}
                      mode="text"
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      dataCy="name"
                      labelV2="name"
                      errors={errors}
                    />
                  </div>

                  {!loading && data && (
                    <div className={Styles.field}>
                      <InputChameleon
                        label={t('providerLabel')}
                        required
                        value={manufacturerId}
                        onChange={(e) => {
                          setManufacturerId(
                            Number(e.target.value)
                          );
                        }}
                        mode="select"
                        options={data?.manufacturers?.map(
                          (item) => {
                            return {
                              value: item.id,
                              label: item.name,
                            };
                          }
                        )}
                        dataCy="manufacturer"
                        labelV2="manufacturerId"
                        errors={errors}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div
                className="ch-spaceInlineGroup--s"
                style={{ marginTop: '2rem' }}
              >
                <ButtonChameleon
                  dataTestId="btn-createOrEditBrand"
                  label={
                    id
                      ? t('editBrandLabel')
                      : t('newBrandLabel')
                  }
                  primary
                  icon={false}
                  onClick={
                    id
                      ? handleUpdateBrandSubmit
                      : handleCreateBrandSubmit
                  }
                />
                <ButtonChameleon
                  dataTestId="btn-createOrEditBrand-cancel"
                  label={t('cancelLabel')}
                  outline
                  icon={false}
                  onClick={handleCancel}
                />
              </div>
            </form>
          </div>
        </div>
      </Content>
    </>
  );
}
