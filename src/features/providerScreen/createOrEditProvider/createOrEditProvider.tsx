import React, { useState, useEffect } from 'react';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import { routes } from '../../../utils/routes';
import Styles from './createOrEditProvider.module.scss';
import {
  CREATE_PROVIDER,
  GET_PROVIDER,
  UPDATE_PROVIDER,
} from '../../../graphql/queries/providers';
import { submitProvider } from '../../../store/actions/submitProviders';
import InputChameleon from '../../../components/Chameleon/InputChameleon';
import ButtonChameleon from '../../../components/Chameleon/ButtonChameleon';
import { states } from '../../../utils/constants/states';
import {
  formatZipCode,
  unformatZipCode,
} from '../../../utils/formatters/zipcode';
import { getAddressByCep } from '../../../services/providerService';

/* eslint-disable jsx-a11y/label-has-associated-control */

export default function CreateProvider() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const [errors, setErrors] = useState([]);
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
    useState<string>('');

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
      const { errors: errorsCreate } =
        response.createProvider;

      if (!errorsCreate.length) {
        dispatch(submitProvider({ type: 'create' }));
        router.push(routes.providers.index);
      } else {
        setErrors(errorsCreate);
      }
    },
  });

  const handleSubmitCreateProvider = () => {
    createProvider({
      variables: {
        input: {
          document: identifier.replace(/[^\d]+/g, ''),
          name: companyName,
          tradingName: fantasyName,
          stateInscriptionType: indicatorSign || null,
          providerType:
            typeProvider === 'Distribuidora'
              ? 'distributor'
              : 'carrier',
          externalId: identifierExternal,

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
  };
  // Finish Logic For Create Provider

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
          : 9
      );
      setTypeProvider(
        dataGet.provider.providerType === 'distributor'
          ? 'Distribuidora'
          : 'Transportadora'
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
      const { errors: errorsEdit } =
        response.updateProvider;

      if (!errorsEdit.length) {
        dispatch(submitProvider({ type: 'edit' }));
        router.push(routes.providers.index);
      } else {
        setErrors(errorsEdit);
      }
    },
  });

  const handleSubmitEditProvider = () => {
    updateProvider({
      variables: {
        input: {
          id,
          document: identifier.replace(/[^\d]+/g, ''),
          name: companyName,
          tradingName: fantasyName,
          stateInscriptionType: indicatorSign || null,
          providerType:
            typeProvider === 'Distribuidora'
              ? 'distributor'
              : 'carrier',
          externalId: identifierExternal,
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
    setIdentifierExternal('');
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
    if (zipCode.length === 8) {
      getAddressByCep(zipCode).then((response) => {
        const {
          bairro,
          complemento,
          ibge,
          localidade,
          logradouro,
          uf,
        } = response.data;

        setStreet(logradouro);
        setAddressDetail(complemento);
        setCity(localidade);
        setCityIbgeId(ibge);
        setDistrict(bairro);
        setStateName(uf);
      });
    }
  };

  if (errorsGetProvider && id) {
    return (
      <div data-testid="container-error-data">
        <h1>Screen error</h1>
      </div>
    );
  }
  // only get provider
  if (loadingGetProvider) {
    return (
      <div data-testid="container-loading-data">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div
      className={Styles.containerForm}
      data-testid="container-createOrEdit-provider"
    >
      <h1 className="ch-spaceStack">
        {id ? 'Editar Fornecedor' : 'Novo Fornecedor'}
      </h1>
      {errors.length > 0 && (
        <Alert severity="error">
          <AlertTitle>
            {`Erro ao ${
              id ? 'editar' : 'criar'
            } fornecedor.`}
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
      <div
        className={`${Styles.wrapperIpt} ${Styles.wrapperIptFirst}`}
      >
        <InputChameleon
          label="CPF/CNPJ"
          required
          value={identifier}
          onChange={(e) => onChangeIdentifier(e)}
          mode="text"
        />
      </div>
      <div className={Styles.wrapperIptRow}>
        <div className={Styles.wrapperIpt}>
          <InputChameleon
            label="Razão Social/Nome"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            mode="text"
          />
        </div>
        <div className={Styles.wrapperIpt}>
          <InputChameleon
            label="Nome Fantasia"
            required={false}
            value={fantasyName}
            onChange={(e) => setFantasyName(e.target.value)}
            mode="text"
          />
        </div>
      </div>
      <div className={Styles.wrapperIptRow}>
        <div className={Styles.wrapperIpt}>
          <InputChameleon
            label="Tipo de Fornecedor"
            required
            value={typeProvider}
            onChange={(e) => {
              setTypeProvider(e.target.value.toString());
            }}
            mode="select"
            options={[
              {
                value: 'Transportadora',
                label: 'Transportadora',
              },
              {
                value: 'Distribuidora',
                label: 'Distribuidora',
              },
            ]}
          />
        </div>
        <div className={Styles.wrapperIpt}>
          <InputChameleon
            label="Indicador Inscrição Estadual"
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
          />
        </div>
      </div>
      <div className={Styles.wrapperIptRow}>
        <div className={Styles.wrapperIpt}>
          <InputChameleon
            label="Inscrição Estadual"
            required={false}
            value={stateInscription}
            onChange={(e) => {
              setStateInscription(e.target.value);
            }}
            mode="text"
          />
        </div>

        <div className={Styles.wrapperIpt}>
          <InputChameleon
            label="ID Externo"
            required={false}
            value={identifierExternal}
            onChange={(e) => {
              setIdentifierExternal(e.target.value);
            }}
            mode="text"
          />
        </div>
      </div>

      <div
        className="ch-spaceStackGroup--s"
        style={{ marginTop: '2rem' }}
      >
        <h2 className="ch-title ch-title--5">Endereço</h2>
      </div>
      <div
        className={`${Styles.wrapperIptSM} ${Styles.wrapperIptFirst}`}
      >
        <InputChameleon
          label="CEP"
          required={false}
          value={formattedZipCode}
          onChange={onZipCodeChange}
          onKeyUp={zipCodeKeyUp}
          mode="text"
        />
      </div>
      <div className={Styles.wrapperIptRow}>
        <div className={Styles.wrapperIpt}>
          <InputChameleon
            label="Logradouro"
            required={false}
            value={street}
            onChange={(e) => {
              setStreet(e.target.value);
            }}
            mode="text"
          />
        </div>
        <div className={Styles.wrapperIptSM}>
          <InputChameleon
            label="Número"
            required={false}
            value={addressNumber}
            onChange={(e) => {
              setAddressNumber(e.target.value);
            }}
            mode="text"
          />
        </div>
        <div className={Styles.wrapperIptSM}>
          <InputChameleon
            label="Complemento"
            required={false}
            value={addressDetail}
            onChange={(e) => {
              setAddressDetail(e.target.value);
            }}
            mode="text"
          />
        </div>
      </div>
      <div className={Styles.wrapperIptRow}>
        <div className={Styles.wrapperIptSM}>
          <InputChameleon
            label="Bairro"
            required={false}
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
            }}
            mode="text"
          />
        </div>

        <div className={Styles.wrapperIptSM}>
          <InputChameleon
            label="Município"
            required={false}
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
            mode="text"
          />
        </div>

        <div className={Styles.wrapperIptSM}>
          <InputChameleon
            label="Cod. do município no IBGE"
            required={false}
            value={cityIbgeId}
            onChange={(e) => {
              setCityIbgeId(e.target.value);
            }}
            mode="text"
          />
        </div>

        <div className={Styles.wrapperIptSM}>
          <InputChameleon
            label="Estado"
            required={false}
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            mode="select"
            options={states.map((state) => ({
              label: state.code,
              value: state.code,
            }))}
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
            id ? 'Editar Fornecedor' : 'Criar Fornecedor'
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
          label="Cancelar"
          outline
          icon={false}
          onClick={() => {
            router.push(routes.providers.index);
            resetForm();
          }}
        />
      </div>
    </div>
  );
}
