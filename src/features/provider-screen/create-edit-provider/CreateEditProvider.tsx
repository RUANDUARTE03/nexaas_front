/* eslint-disable react/jsx-curly-newline */
/* eslint-disable prefer-destructuring */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useMemo } from 'react';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'next-i18next';
import AlertCustom from '../../../components/alert';
import { IErrorsGraphql } from '../../brands-page/dtos';
import { routes } from '../../../utils/routes';
import Styles from './CreateEditProvider.module.scss';
import {
  CREATE_PROVIDER,
  GET_PROVIDER,
  UPDATE_PROVIDER,
} from '../../../graphql/queries/providers';
import { submitProvider } from '../../../store/actions/submitProviders';
import InputChameleon from '../../../components/Chameleon/input-chameleon';
import ButtonChameleon from '../../../components/Chameleon/button-chameleon';
import { states } from '../../../utils/constants/states';
import {
  formatZipCode,
  unformatZipCode,
} from '../../../utils/formatters/zipcode';
import { getAddressByCep } from '../../../services/providerService';
import HeaderMenu from '../../header-menu';

export default function CreateOrEditProvider() {
  const { t } = useTranslation('create-edit-provider');
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const { type } = useSelector(
    (state) => state.SubmitProvider
  );
  const [showModalErrors, setShowModalErros] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<IErrorsGraphql[]>();
  const [identifier, setIdentifier] = useState<string>('');
  const [companyName, setCompanyName] =
    useState<string>('');
  const [fantasyName, setFantasyName] =
    useState<string>('');
  const [typeProvider, setTypeProvider] =
    useState<string>();
  const [indicatorSign, setIndicatorSign] =
    useState<number>();
  const [stateInscription, setStateInscription] =
    useState<string>();
  const [stateName, setStateName] = useState<number>();
  const [identifierExternal, setIdentifierExternal] =
    useState(null);

  const [zipCode, setZipCode] = useState<string>();
  const [formattedZipCode, setFormattedZipCode] =
    useState<string>();

  const [street, setStreet] = useState<string>();
  const [addressNumber, setAddressNumber] =
    useState<string>();
  const [addressDetail, setAddressDetail] =
    useState<string>();
  const [city, setCity] = useState<string>();
  const [cityIbgeId, setCityIbgeId] = useState<string>();
  const [district, setDistrict] = useState<string>();

  // Init Logic For Create Provider
  const [createProvider] = useMutation(CREATE_PROVIDER, {
    onCompleted: (response) => {
      const res = response.createProvider;
      const errorsCreate: IErrorsGraphql[] = res.errors;
      const success: boolean = res.success;

      if (success) {
        dispatch(submitProvider({ type: 'create' }));
        router.push(routes.providers.index);
        setShowModalErros(false);
      } else {
        setShowModalErros(true);
        setErrors(errorsCreate);
      }
    },
  });

  const handleSubmitCreateProvider = () => {
    if (!addressNumber || !zipCode) {
      if (!zipCode) {
        setErrors([
          {
            code: 'blank',
            message: 'CEP não pode ficar em branco',
            path: ['attributes', 'CEP'],
          },
        ]);
      } else {
        setErrors([
          {
            code: 'blank',
            message: 'Número não pode ficar em branco',
            path: ['attributes', 'addressNumber'],
          },
        ]);
      }
      setShowModalErros(true);
    } else {
      createProvider({
        variables: {
          input: {
            document: identifier.replace(/[^\d]+/g, ''),
            name: companyName,
            tradingName: fantasyName,
            stateInscriptionType: indicatorSign || null,
            providerType:
              indentifyProviderTypeValue(typeProvider),
            externalId: identifierExternal || null,
            street,
            number: addressNumber,
            detail: addressDetail,
            zipcode: zipCode,
            neighborhood: district,
            cityCode: cityIbgeId,
            city,
            state: stateName || null,
            country: 'Brazil',
            stateInscription: stateInscription || null,
          },
        },
      });
    }
  };
  // Finish Logic For Create Provider

  const indentifyProviderType = (providerType: string) => {
    if (providerType === 'manufacturer') {
      return 'Fabricante';
    }

    if (providerType === 'importer') {
      return 'Importadora';
    }

    if (providerType === 'distributor') {
      return 'Distribuidora';
    }

    if (providerType === 'carrier') {
      return 'Transportadora';
    }

    return '';
  };

  const indentifyProviderTypeValue = (
    providerType: string
  ) => {
    if (providerType === 'Fabricante') {
      return 'manufacturer';
    }

    if (providerType === 'Importadora') {
      return 'importer';
    }

    if (providerType === 'Distribuidora') {
      return 'distributor';
    }

    if (providerType === 'Transportadora') {
      return 'carrier';
    }

    return '';
  };

  // Init Logic For Edit Provider
  const {
    loading: loadingGetProvider,
    error: errorsGetProvider,
    data: dataGet,
  } = useQuery(GET_PROVIDER, { variables: { id } });

  useEffect(() => {
    if (dataGet && dataGet.provider) {
      setIdentifier(
        dataGet.provider.document.length === 11
          ? cpf.format(dataGet.provider.document)
          : cnpj.format(dataGet.provider.document)
      );
      setCompanyName(dataGet.provider.name);
      setFantasyName(dataGet.provider.tradingName);
      setIndicatorSign(
        dataGet.provider.stateInscriptionType === 'icms'
          ? 1
          : dataGet.provider.stateInscriptionType === 'free'
          ? 2
          : 9
      );
      setTypeProvider(
        indentifyProviderType(dataGet.provider.providerType)
      );
      setIdentifierExternal(dataGet.provider.externalId);
      setStateName(dataGet.provider.state);
      setStateInscription(
        dataGet.provider.stateInscription
      );
      setZipCode(dataGet.provider.zipcode);
      setFormattedZipCode(
        formatZipCode(dataGet.provider.zipcode)
      );
      setStreet(dataGet.provider.street);
      setAddressNumber(dataGet.provider.number);
      setAddressDetail(dataGet.provider.detail);
      setCity(dataGet.provider.city);
      setCityIbgeId(dataGet.provider.cityCode);
      setDistrict(dataGet.provider.neighborhood);
    }
  }, [dataGet]);

  const [updateProvider] = useMutation(UPDATE_PROVIDER, {
    onCompleted: (response) => {
      const res = response.updateProvider;
      const errorsEdit: IErrorsGraphql[] = res.errors;
      const success: boolean = res.success;

      if (success) {
        dispatch(submitProvider({ type: 'edit' }));
        router.push(routes.providers.index);
        setShowModalErros(false);
      } else {
        setShowModalErros(true);
        setErrors(errorsEdit);
      }
    },
  });

  const handleSubmitEditProvider = () => {
    if (!addressNumber || !zipCode) {
      if (!zipCode) {
        setErrors([
          {
            code: 'blank',
            message: 'CEP não pode ficar em branco',
            path: ['attributes', 'CEP'],
          },
        ]);
      } else {
        setErrors([
          {
            code: 'blank',
            message: 'Número não pode ficar em branco',
            path: ['attributes', 'addressNumber'],
          },
        ]);
      }
      setShowModalErros(true);
    } else {
      updateProvider({
        variables: {
          input: {
            id,
            document: identifier.replace(/[^\d]+/g, ''),
            name: companyName,
            tradingName: fantasyName,
            stateInscriptionType: indicatorSign || null,
            providerType:
              indentifyProviderTypeValue(typeProvider),
            externalId: identifierExternal || null,
            street,
            number: addressNumber,
            detail: addressDetail,
            zipcode: zipCode,
            neighborhood: district,
            cityCode: cityIbgeId,
            city,
            state: stateName || null,
            country: 'Brazil',
            stateInscription: stateInscription || null,
          },
        },
      });
    }
  };

  // Finish Logic For Edit Provider

  const resetForm = () => {
    setIdentifier('');
    // setErroIdentifier(false);
    setCompanyName('');
    setFantasyName('');
    setTypeProvider(undefined);
    setIndicatorSign(undefined);
    setStateName(undefined);
    setStateInscription('');
    setIdentifierExternal(undefined);
  };

  const onChangeIdentifier = (e: any) => {
    const ev = e.target.value;
    const event = ev.replace(/\D/gim, '');

    if (event.length <= 11) {
      const valueReplace = cpf.format(event);
      setIdentifier(valueReplace);
    } else if (event.length <= 14) {
      const valueReplace = cnpj.format(event);
      setIdentifier(valueReplace);
    }
  };

  const onZipCodeChange = (e: any) => {
    const { value } = e.target;

    if (value.length === 8) {
      setFormattedZipCode(formatZipCode(value));
    } else {
      setFormattedZipCode(value);
    }

    setZipCode(unformatZipCode(value));
  };

  const zipCodeKeyUp = () => {
    if (zipCode?.length === 8) {
      getAddressByCep(zipCode).then((response) => {
        const {
          bairro,
          complemento,
          ibge,
          localidade,
          logradouro,
          uf,
          erro,
        } = response.data;

        if (!erro) {
          setStreet(logradouro);
          setAddressDetail(complemento);
          setCity(localidade);
          setCityIbgeId(ibge);
          setDistrict(bairro);
          setStateName(uf);
          setShowModalErros(true);
        } else {
          setErrors([
            {
              code: 'invalid',
              message: 'CEP não é válido',
              path: ['attributes', 'CEP'],
            },
          ]);
          setStreet('');
          setAddressDetail('');
          setCity('');
          setCityIbgeId('');
          setDistrict('');
          setStateName(undefined);
          setShowModalErros(true);
        }
      });
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

  if (errorsGetProvider && id) {
    return (
      <div data-testid="container-error-data">
        <h1>{t('error')}</h1>
      </div>
    );
  }

  // only get provider
  if (loadingGetProvider) {
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
              router.push(routes.providers.index);
              resetForm();
            },
          },
          { text: id ? t('editLabel') : t('newLabel') },
        ]}
      />
      <div
        className={Styles.containerForm}
        data-testid="container-createOrEdit-provider"
      >
        <h1 className="ch-spaceStack">
          {id ? t('editProvider') : t('createProvider')}
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

        <div
          className={`${Styles.wrapperIpt} ${Styles.wrapperIptFirst}`}
        >
          <InputChameleon
            label={t('identifier')}
            required
            value={identifier}
            onChange={(e) => onChangeIdentifier(e)}
            mode="text"
            dataCy="identifier"
            labelV2="document"
            errors={errors}
            setErrors={(errorsFilter: IErrorsGraphql[]) =>
              setErrors(errorsFilter)
            }
          />
        </div>
        <div className={Styles.wrapperIptRow}>
          <div className={Styles.wrapperIpt}>
            <InputChameleon
              label={t('companyName')}
              required
              value={companyName}
              onChange={(e) =>
                setCompanyName(e.target.value)
              }
              mode="text"
              dataCy="companyName"
              labelV2="name"
              errors={errors}
              setErrors={(errorsFilter: IErrorsGraphql[]) =>
                setErrors(errorsFilter)
              }
            />
          </div>
          <div className={Styles.wrapperIpt}>
            <InputChameleon
              label={t('fantasyName')}
              required={false}
              value={fantasyName}
              onChange={(e) =>
                setFantasyName(e.target.value)
              }
              mode="text"
              dataCy="fantasyName"
              labelV2="tradingName"
              errors={errors}
              setErrors={(errorsFilter: IErrorsGraphql[]) =>
                setErrors(errorsFilter)
              }
            />
          </div>
        </div>
        <div className={Styles.wrapperIptRow}>
          <div className={Styles.wrapperIpt}>
            <InputChameleon
              label={t('typeProvider')}
              required
              value={typeProvider}
              onChange={(e) => {
                setTypeProvider(e.target.value.toString());
              }}
              mode="select"
              options={[
                {
                  value: 'Fabricante',
                  label: 'Fabricante',
                },
                {
                  value: 'Importadora',
                  label: 'Importadora',
                },
                {
                  value: 'Distribuidora',
                  label: 'Distribuidora',
                },
                {
                  value: 'Transportadora',
                  label: 'Transportadora',
                },
              ]}
              dataCy="typeProvider"
              labelV2="providerType"
              errors={errors}
              setErrors={(errorsFilter: IErrorsGraphql[]) =>
                setErrors(errorsFilter)
              }
            />
          </div>
          <div className={Styles.wrapperIpt}>
            <InputChameleon
              label={t('indicatorSign')}
              required={false}
              value={indicatorSign}
              onChange={(e) => {
                setIndicatorSign(Number(e.target.value));
              }}
              mode="select"
              options={[
                {
                  value: 1,
                  label: '1: Contribuinte ICMS',
                },
                {
                  value: 2,
                  label: '2: Contribuinte Isento',
                },
                {
                  value: 9,
                  label: '9: Não Contribuinte',
                },
              ]}
              dataCy="indicatorSign"
              labelV2="stateInscriptionType"
              errors={errors}
              setErrors={(errorsFilter: IErrorsGraphql[]) =>
                setErrors(errorsFilter)
              }
            />
          </div>
        </div>
        <div className={Styles.wrapperIptRow}>
          <div className={Styles.wrapperIpt}>
            <InputChameleon
              label={t('identifierExternal')}
              required={false}
              value={identifierExternal}
              onChange={(e) => {
                setIdentifierExternal(e.target.value);
              }}
              mode="text"
              dataCy="identifierExternal"
              labelV2="externalId"
              errors={errors}
              setErrors={(errorsFilter: IErrorsGraphql[]) =>
                setErrors(errorsFilter)
              }
            />
          </div>

          <div
            className={Styles.wrapperIpt}
            style={{ whiteSpace: 'nowrap' }}
          >
            <InputChameleon
              label={t('stateInscription')}
              required={false}
              value={stateInscription}
              onChange={(e) => {
                setStateInscription(e.target.value);
              }}
              mode="text"
              dataCy="stateInscription"
              labelV2="stateInscription"
              errors={errors}
              setErrors={(errorsFilter: IErrorsGraphql[]) =>
                setErrors(errorsFilter)
              }
            />
          </div>
        </div>

        <div
          className="ch-spaceStackGroup--s"
          style={{ marginTop: '2rem' }}
        >
          <h2 className="ch-title ch-title--5">
            {t('address')}
          </h2>
        </div>
        <div
          className={`${Styles.wrapperIptSM} ${Styles.wrapperIptFirst}`}
        >
          <InputChameleon
            label={t('formattedZipCode')}
            required
            value={formattedZipCode}
            onChange={onZipCodeChange}
            onKeyUp={zipCodeKeyUp}
            mode="text"
            dataCy="formattedZipCode"
            labelV2="CEP"
            errors={errors}
            setErrors={(errorsFilter: IErrorsGraphql[]) =>
              setErrors(errorsFilter)
            }
          />
        </div>
        <div className={Styles.wrapperIptRow}>
          <div className={Styles.wrapperIpt}>
            <InputChameleon
              label={t('street')}
              required
              value={street}
              onChange={(e) => {
                setStreet(e.target.value);
              }}
              mode="text"
              dataCy="street"
              errors={errors}
              setErrors={(errorsFilter: IErrorsGraphql[]) =>
                setErrors(errorsFilter)
              }
            />
          </div>
          <div className={Styles.wrapperIptSM}>
            <InputChameleon
              label={t('addressNumber')}
              required
              value={addressNumber}
              onChange={(e) => {
                setAddressNumber(e.target.value);
              }}
              mode="text"
              dataCy="addressNumber"
              labelV2="addressNumber"
              errors={errors}
              setErrors={(errorsFilter: IErrorsGraphql[]) =>
                setErrors(errorsFilter)
              }
            />
          </div>
          <div className={Styles.wrapperIptSM}>
            <InputChameleon
              label={t('addressDetail')}
              required
              value={addressDetail}
              onChange={(e) => {
                setAddressDetail(e.target.value);
              }}
              mode="text"
              dataCy="addressDetail"
              errors={errors}
              setErrors={(errorsFilter: IErrorsGraphql[]) =>
                setErrors(errorsFilter)
              }
            />
          </div>
        </div>
        <div className={Styles.wrapperIptRow}>
          <div className={Styles.wrapperIptSM}>
            <InputChameleon
              label={t('district')}
              required
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
              }}
              mode="text"
              dataCy="district"
              errors={errors}
              setErrors={(errorsFilter: IErrorsGraphql[]) =>
                setErrors(errorsFilter)
              }
            />
          </div>

          <div className={Styles.wrapperIptSM}>
            <InputChameleon
              label={t('city')}
              required
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
              }}
              mode="text"
              dataCy="city"
              errors={errors}
              setErrors={(errorsFilter: IErrorsGraphql[]) =>
                setErrors(errorsFilter)
              }
            />
          </div>

          <div
            className={Styles.wrapperIptMD}
            style={{ whiteSpace: 'nowrap' }}
          >
            <InputChameleon
              label={t('cityIbgeId')}
              required
              value={cityIbgeId}
              onChange={(e) => {
                setCityIbgeId(e.target.value);
              }}
              mode="text"
              dataCy="cityIbgeId"
              errors={errors}
              setErrors={(errorsFilter: IErrorsGraphql[]) =>
                setErrors(errorsFilter)
              }
            />
          </div>

          <div className={Styles.wrapperIptSM}>
            <InputChameleon
              label={t('stateName')}
              required
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              mode="select"
              options={states.map((state) => ({
                label: state.code,
                value: state.code,
              }))}
              dataCy="stateName"
              errors={errors}
              setErrors={(errorsFilter: IErrorsGraphql[]) =>
                setErrors(errorsFilter)
              }
            />
          </div>
        </div>

        <div
          className="ch-spaceInlineGroup--s"
          style={{ marginTop: '2rem' }}
        >
          <ButtonChameleon
            dataTestId="btn-createOrEditProvider"
            label={
              id
                ? 'Atualizar Fornecedor'
                : 'Criar Fornecedor'
            }
            primary
            icon={false}
            onClick={
              id
                ? handleSubmitEditProvider
                : handleSubmitCreateProvider
            }
          />
          <ButtonChameleon
            dataTestId="btn-createOrEditProvider-cancel"
            label={t('cancelLabel')}
            outline
            icon={false}
            onClick={() => {
              router.push(routes.providers.index);
              resetForm();
            }}
          />
        </div>
      </div>
    </>
  );
}
