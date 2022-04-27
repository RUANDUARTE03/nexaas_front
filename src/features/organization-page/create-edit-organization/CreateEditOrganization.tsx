/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable prefer-destructuring */
import React, { useEffect, useState, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { cnpj as cnpjFormatter } from 'cpf-cnpj-validator';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'next-i18next';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import AlertCustom from '../../../components/alert';
import { IErrorsGraphql } from '../../brands-page/dtos';
import InputChameleon from '../../../components/Chameleon/input-chameleon';
import {
  CREATE_ORGANIZATION,
  GET_ORGANIZATION,
  UPDATE_ORGANIZATION,
} from '../../../graphql/queries/organizations';
import Styles from './CreateEditOrganization.module.scss';
import { routes } from '../../../utils/routes';
import {
  DeliveryRadiusMax,
  Kind,
  TaxRegime,
} from '../../../utils/constants/Organization';
import { states } from '../../../utils/constants/states';
import {
  formatZipCode,
  unformatZipCode,
} from '../../../utils/formatters/zipcode';
import { getAddressByCep } from '../../../services/providerService';
import ButtonChameleon from '../../../components/Chameleon/button-chameleon';
import { formatValueToReal } from '../../../utils/formatters/Currency';
import { SubmitOrganizations } from '../../../store/actions/submitOrganizations';
import HeaderMenu from '../../header-menu';
import Content from '../../../components/content';
import { getLatLngByZipCode } from '../../../services/mapsService';
import GMap from '../../../components/google-map/GMap';

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-wrap-multilines */

type customerAquisitionChannelsProps = {
  id: number;
  name: string;
};

export default function CreateEditOrganization() {
  const { t } = useTranslation('create-edit-organization');
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { type } = useSelector(
    (state) => state.SubmitOrganizations
  );
  const [showModalErrors, setShowModalErros] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<IErrorsGraphql[]>();
  const [name, setName] = useState<string>();
  const [cnpj, setCnpj] = useState<string>();
  const [stateRegistration, setStateRegistration] =
    useState<string>();
  const [companyName, setCompanyName] = useState<string>();
  const [averageWithdrawalTerm, setAverageWithdrawalTerm] =
    useState<string>();
  const [
    averageWithdrawalPrice,
    setAverageWithdrawalPrice,
  ] = useState<string>();
  const [deliveryRadiusMax, setDeliveryRadiusMax] =
    useState<string>();
  const [kind, setKind] = useState<string>();
  const [cityCode, setCityCode] = useState<string>();
  const [city, setCity] = useState<string>();
  const [street, setStreet] = useState<string>();
  const [state, setState] = useState<string>();
  const [number, setNumber] = useState<string>();
  const [neighborhood, setNeighborhood] =
    useState<string>();
  const [zipCode, setZipCode] = useState<string>();
  const [complement, setComplement] = useState<string>();
  const [latitude, setLatitude] = useState<string>();
  const [longitude, setLongitude] = useState<string>();
  const [emitesId, setEmitesId] = useState<number>();
  const [serieNfe, setSerieNfe] = useState<string>();
  const [taxRegime, setTaxRegime] = useState<string>();
  const [useAverageCost, setUseAverageCost] =
    useState<boolean>();

  const [
    customerAquisitionChannels,
    setCustomerAquisitionChannels,
  ] = useState<
    customerAquisitionChannelsProps[] | undefined
  >();
  const [aquisitionChannels, setAquisitionChannels] =
    useState<
      customerAquisitionChannelsProps[] | undefined
    >();

  const [createOrganization] = useMutation(
    CREATE_ORGANIZATION,
    {
      onCompleted: (response) => {
        const res = response.createOrganization;
        const errorsCreate: IErrorsGraphql[] = res.errors;
        const success: boolean = res.success;

        if (success) {
          dispatch(SubmitOrganizations({ type: 'create' }));
          router.push(routes.organizations.index);
          setShowModalErros(false);
        } else {
          setShowModalErros(true);
          setErrors(errorsCreate);
        }
      },
    }
  );

  const {
    loading: loadingGetOrganization,
    error: errorsGetOrganization,
    data: dataGet,
  } = useQuery(GET_ORGANIZATION, { variables: { id } });

  useEffect(() => {
    if (dataGet && dataGet.organization) {
      const { organization } = dataGet;

      setName(organization.name);
      setCnpj(cnpjFormatter.format(organization.cnpj));
      setStateRegistration(organization.stateRegistration);
      setCompanyName(organization.companyName);
      setAverageWithdrawalTerm(
        organization.averageWithdrawalTerm
      );
      setAverageWithdrawalPrice(
        organization.averageWithdrawalPrice
      );
      setDeliveryRadiusMax(organization.deliveryRadiusMax);
      setKind(organization.kind);
      setCityCode(organization.cityCode);
      setCity(organization.city);
      setStreet(organization.street);
      setState(organization.state);
      setNumber(organization.number);
      setNeighborhood(organization.neighborhood);
      setZipCode(organization.zipCode);
      setComplement(organization.complement);
      setLatitude(organization.latitude);
      setLongitude(organization.longitude);
      setEmitesId(organization.emitesId);
      setSerieNfe(organization.serieNfe);
      setTaxRegime(organization.taxRegime);
      setUseAverageCost(organization.useAverageCost);
      setCustomerAquisitionChannels(
        organization.customerAquisitionChannels
      );
      setAquisitionChannels(
        organization.aquisitionChannels
      );
    }
  }, [dataGet]);

  function handleCancel(): void {
    router.push(routes.organizations.index);
  }

  function onWithdrawPriceChange(e) {
    const formattedValue = formatValueToReal(
      e.target.value
    );

    setAverageWithdrawalPrice(formattedValue);
  }

  const onZipCodeChange = (e: any) => {
    const { value } = e.target;

    if (value.length === 8) {
      setZipCode(formatZipCode(value));
    } else {
      setZipCode(value);
    }
  };

  const zipCodeKeyUp = () => {
    if (zipCode?.replace('-', '').length === 8) {
      getAddressByCep(zipCode?.replace('-', '')).then(
        (response) => {
          const {
            bairro,
            complemento,
            ibge,
            localidade,
            logradouro,
            uf,
          } = response.data;

          setStreet(logradouro);
          setComplement(complemento);
          setCity(localidade);
          setCityCode(ibge);
          setNeighborhood(bairro);
          setState(uf);

          getLatLngByZipCode(zipCode).then((data) => {
            const { lat, lng } =
              data.data.results[0]?.geometry.location;
            setLatitude(lat);
            setLongitude(lng);
          });
        }
      );
    }
  };

  const handleCreateOrganizationsSubmit = () => {
    if (!number || !zipCode) {
      if (!zipCode) {
        setErrors([
          {
            code: 'blank',
            message: 'CEP não pode ficar em branco',
            path: ['attributes', 'CEP'],
          },
          {
            code: 'blank',
            message:
              'Razão social não pode ficar em branco',
            path: ['attributes', 'CompanyName'],
          },
          {
            code: 'blank',
            message:
              'Nome Fantasia não pode ficar em branco',
            path: ['attributes', 'TradeName'],
          },
          {
            code: 'blank',
            message: 'CNPJ não pode ficar em branco',
            path: ['attributes', 'CNPJ'],
          },
          {
            code: 'blank',
            message:
              'Inscrição estadual não pode ficar em branco',
            path: ['attributes', 'StateRegistration'],
          },
          {
            code: 'blank',
            message:
              'Tipo de Organização não pode ficar em branco',
            path: ['attributes', 'OrganizationType'],
          },
          {
            code: 'blank',
            message:
              'Raio máximo de entrega não pode ficar em branco',
            path: ['attributes', 'Maximumdeliveryradius'],
          },
          {
            code: 'blank',
            message:
              'ID no Emites não pode ficar em branco',
            path: ['attributes', 'IDinIssues'],
          },
          {
            code: 'blank',
            message:
              'Série da ultima nota não pode ficar em branco',
            path: ['attributes', 'Lastnoteseries'],
          },
          {
            code: 'blank',
            message:
              'Regime tributário não pode ficar em branco',
            path: ['attributes', 'Taxregime'],
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
      createOrganization({
        variables: {
          input: {
            name,
            cnpj: cnpj?.replace(/[^\d]+/g, ''),
            stateRegistration,
            companyName,
            averageWithdrawalTerm: Number(
              averageWithdrawalTerm
            ),
            averageWithdrawalPrice: Number(
              averageWithdrawalPrice?.replace(',', '')
            ),
            deliveryRadiusMax,
            kind,
            cityCode,
            city,
            street,
            state,
            number,
            neighborhood,
            zipCode: unformatZipCode(zipCode),
            complement,
            latitude,
            longitude,
            emitesId: Number(emitesId),
            serieNfe,
            taxRegime,
            useAverageCost,
          },
        },
      });
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [updateOrganization] = useMutation(
    UPDATE_ORGANIZATION,
    {
      onCompleted: (response) => {
        const res = response.updateOrganizations;
        const errorsEdit: IErrorsGraphql[] = res.errors;
        const success: boolean = res.success;

        if (success) {
          dispatch(SubmitOrganizations({ type: 'edit' }));
          router.push(routes.organizations.index);
          setShowModalErros(false);
        } else {
          setShowModalErros(true);
          setErrors(errorsEdit);
        }
      },
    }
  );

  const handleUpdateOrganizationsSubmit = () => {
    const newChannelsIds = [];
    customerAquisitionChannels?.map((cac) =>
      newChannelsIds.push(cac.id)
    );

    updateOrganization({
      variables: {
        input: {
          id,
          name,
          cnpj: cnpj?.replace(/[^\d]+/g, ''),
          stateRegistration,
          companyName,
          averageWithdrawalTerm: Number(
            averageWithdrawalTerm
          ),
          averageWithdrawalPrice: Number(
            averageWithdrawalPrice
          ),
          deliveryRadiusMax,
          kind,
          cityCode,
          city,
          street,
          state,
          number,
          neighborhood,
          zipCode: unformatZipCode(zipCode),
          complement,
          latitude,
          longitude,
          emitesId: Number(emitesId),
          serieNfe,
          taxRegime,
          useAverageCost,
          aquisitionChannelIds: newChannelsIds,
        },
      },
    });
  };

  const onChangeChannel = (
    channel: customerAquisitionChannelsProps
  ) => {
    const checkIsActive =
      customerAquisitionChannels.includes(channel);
    if (checkIsActive) {
      const removeChannel =
        customerAquisitionChannels.filter(
          (cha) => cha.id !== channel.id
        );
      setCustomerAquisitionChannels(removeChannel);
    } else {
      const joined = [];
      customerAquisitionChannels?.map((chan) =>
        joined.push(chan)
      );
      joined.push(channel);
      setCustomerAquisitionChannels(joined);
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

  if (errorsGetOrganization && id) {
    return (
      <div data-testid="container-error-data">
        <h1>{t('error')}</h1>
      </div>
    );
  }

  if (loadingGetOrganization) {
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
              router.push(routes.organizations.index);
            },
          },
          { text: id ? t('editLabel') : t('newLabel') },
        ]}
      />
      <Content>
        <div className={Styles.createEditOrganization}>
          <h1 className="ch-spaceStack">
            {id ? t('editOrgLabel') : t('newOrgLabel')}
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

          <div className="ch-grid">
            <div className="ch-grid-column--4 ch-grid-column--8Desktop">
              <form className="simple_form ui form ch-spaceStackGroup--xl">
                <div className="ch-spaceStackGroup--s">
                  <h2 className="ch-title">
                    {t('generalDataLabel')}
                  </h2>

                  <div className="ch-fieldGroup ch-fieldGroup--2Tablet">
                    <div className="ch-field">
                      <InputChameleon
                        label={t('nameLabel')}
                        required
                        value={companyName}
                        mode="text"
                        onChange={(e) =>
                          setCompanyName(e.target.value)
                        }
                        dataCy="CompanyName"
                        labelV2="CompanyName"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>

                    <div className="ch-field">
                      <InputChameleon
                        label={t('fantasyNameLabel')}
                        required
                        value={name}
                        mode="text"
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        dataCy="Name"
                        labelV2="Name"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>

                    <div className="ch-field">
                      <InputChameleon
                        label={t('cnpjLabel')}
                        required
                        value={cnpj}
                        mode="text"
                        onChange={(e) =>
                          setCnpj(e.target.value)
                        }
                        dataCy="CNPJ"
                        labelV2="CNPJ"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>

                    <div className="ch-field">
                      <InputChameleon
                        label={t('stateInscriptionLabel')}
                        required
                        value={stateRegistration}
                        mode="text"
                        onChange={(e) =>
                          setStateRegistration(
                            e.target.value
                          )
                        }
                        dataCy="StateRegistration"
                        labelV2="StateRegistration"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>

                    <div className="ch-field">
                      <InputChameleon
                        label={t('orgTypeLabel')}
                        required
                        value={kind}
                        onChange={(e) => {
                          setKind(
                            e.target.value.toString()
                          );
                        }}
                        mode="select"
                        options={[
                          {
                            value: Kind.OWN_STORE,
                            label: t('ownStoreOption'),
                          },
                          {
                            value: Kind.FRANCHISE,
                            label: t('franchiseOption'),
                          },
                          {
                            value: Kind.DISTRIBUTION_CENTER,
                            label: t(
                              'distributionCenterOption'
                            ),
                          },
                          {
                            value: Kind.OTHER,
                            label: t('otherOption'),
                          },
                        ]}
                        dataCy="Kind"
                        labelV2="Kind"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>
                  </div>
                </div>

                <div className="ch-spaceStackGroup--s">
                  <h2 className="ch-title">
                    {t('infoLabel')}
                  </h2>

                  <div className="ch-fieldGroup ch-fieldGroup--2Tablet">
                    <div className="ch-field">
                      <InputChameleon
                        type="number"
                        label={t('averageWithdrawLabel')}
                        required={false}
                        value={averageWithdrawalTerm}
                        mode="text"
                        onChange={(e) =>
                          setAverageWithdrawalTerm(
                            e.target.value
                          )
                        }
                        dataCy="AverageWithdrawalTerm"
                        labelV2="AverageWithdrawalTerm"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>

                    <div className="ch-field">
                      <InputChameleon
                        label={t(
                          'averageWithdrawPriceLabel'
                        )}
                        required={false}
                        value={averageWithdrawalPrice}
                        mode="text"
                        onChange={onWithdrawPriceChange}
                        dataCy="AverageWithdrawalPrice"
                        labelV2="AverageWithdrawalPrice"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>
                  </div>
                </div>

                <div className="ch-spaceStackGroup--s">
                  <h2 className="ch-title">
                    {t('shipingInfoLabel')}
                  </h2>

                  <div className="ch-fieldGroup ch-fieldGroup--2Tablet">
                    <div className="ch-field">
                      <InputChameleon
                        label={t('deliveryRadiusMaxLabel')}
                        required
                        value={deliveryRadiusMax}
                        onChange={(e) => {
                          setDeliveryRadiusMax(
                            e.target.value.toString()
                          );
                        }}
                        mode="select"
                        options={[
                          {
                            value:
                              DeliveryRadiusMax.UNLIMITED,
                            label: t('unlimitedOption'),
                          },
                          {
                            value: DeliveryRadiusMax.THIRDY,
                            label: t('thirdyOption'),
                          },
                          {
                            value: DeliveryRadiusMax.SIXTY,
                            label: t('sixtyOption'),
                          },
                          {
                            value:
                              DeliveryRadiusMax.AHUNDRED,
                            label: t('ahundredOption'),
                          },
                        ]}
                        dataCy="deliveryRadiusMax"
                        labelV2="deliveryRadiusMax"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>
                  </div>
                </div>

                <div className="ch-spaceStackGroup--s">
                  <h2 className="ch-title">
                    {t('addressLabel')}
                  </h2>

                  <div className="ch-fieldGroup">
                    <div className="ch-field">
                      <InputChameleon
                        label={t('zipCodeLabel')}
                        required={false}
                        value={zipCode}
                        mode="text"
                        onChange={onZipCodeChange}
                        dataCy="CEP"
                        labelV2="CEP"
                        errors={errors}
                        onKeyUp={zipCodeKeyUp}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>

                    <div className="ch-field ch-field--2Tablet ch-field--start1Tablet">
                      <InputChameleon
                        label={t('streetLabel')}
                        required={false}
                        value={street}
                        mode="text"
                        onChange={(e) =>
                          setStreet(e.target.value)
                        }
                        dataCy="Street"
                        labelV2="Street"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>

                    <div className="ch-field">
                      <InputChameleon
                        label={t('numberLabel')}
                        required={false}
                        value={number}
                        mode="text"
                        onChange={(e) =>
                          setNumber(e.target.value)
                        }
                        dataCy="Number"
                        labelV2="Number"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>
                    <div className="ch-field">
                      <InputChameleon
                        label={t('complementLabel')}
                        required={false}
                        value={complement}
                        mode="text"
                        onChange={(e) =>
                          setComplement(e.target.value)
                        }
                        dataCy="Complement"
                        labelV2="Complement"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>
                    <div className="ch-field">
                      <InputChameleon
                        label={t('neighborhoodLabel')}
                        required={false}
                        value={neighborhood}
                        mode="text"
                        onChange={(e) =>
                          setNeighborhood(e.target.value)
                        }
                        dataCy="Neighborhood"
                        labelV2="Neighborhood"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>
                    <div className="ch-field">
                      <InputChameleon
                        label={t('cityLabel')}
                        required={false}
                        value={city}
                        mode="text"
                        onChange={(e) =>
                          setCity(e.target.value)
                        }
                        dataCy="City"
                        labelV2="City"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>
                    <div className="ch-field">
                      <InputChameleon
                        label={t('cityCodeLabel')}
                        required={false}
                        value={cityCode}
                        mode="text"
                        onChange={(e) =>
                          setCityCode(e.target.value)
                        }
                        dataCy="CityCode"
                        labelV2="CityCode"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>
                    <InputChameleon
                      label={t('stateLabel')}
                      required={false}
                      value={state}
                      onChange={(e) =>
                        setState(e.target.value)
                      }
                      mode="select"
                      options={states?.map(
                        (actualState) => ({
                          label: actualState.code,
                          value: actualState.code,
                        })
                      )}
                      dataCy="State"
                      labelV2="State"
                      errors={errors}
                      setErrors={(
                        errorsFilter: IErrorsGraphql[]
                      ) => setErrors(errorsFilter)}
                    />
                    <div className="ch-field ch-field--2Tablet">
                      <InputChameleon
                        disabled
                        label={t('latitudeLabel')}
                        required={false}
                        value={latitude}
                        mode="text"
                        onChange={(e) =>
                          setLatitude(e.target.value)
                        }
                        dataCy="Latitude"
                        labelV2="Latitude"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>
                    <div className="ch-field ch-field--2Tablet">
                      <InputChameleon
                        disabled
                        label={t('longitudeLabel')}
                        required={false}
                        value={longitude}
                        mode="text"
                        onChange={(e) =>
                          setLongitude(e.target.value)
                        }
                        dataCy="Longitude"
                        labelV2="Longitude"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>
                  </div>

                  <div className="ch-field ch-field--2Tablet">
                    <GMap lat={latitude} lng={longitude} />
                  </div>
                </div>

                <div className="ch-spaceStackGroup--s">
                  <h2 className="ch-title">
                    {t('tributationLabel')}
                  </h2>

                  <div className="ch-fieldGroup">
                    <div className="ch-field">
                      <InputChameleon
                        type="number"
                        label={t('emitesIdLabel')}
                        required
                        value={emitesId}
                        mode="text"
                        onChange={(e) => {
                          setEmitesId(e.target.value);
                        }}
                        dataCy="EmitesId"
                        labelV2="EmitesId"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>

                    <div className="ch-field">
                      <InputChameleon
                        label={t('serieNfeLabel')}
                        required
                        value={serieNfe}
                        mode="text"
                        onChange={(e) =>
                          setSerieNfe(e.target.value)
                        }
                        dataCy="SerieNfe"
                        labelV2="Serienfe"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>

                    <div className="ch-field ch-field--2Tablet">
                      <InputChameleon
                        label={t('taxRegimeLabel')}
                        required
                        value={taxRegime}
                        onChange={(e) => {
                          setTaxRegime(
                            e.target.value.toString()
                          );
                        }}
                        mode="select"
                        options={[
                          {
                            value: TaxRegime.SIMPLE,
                            label: t('simpleOption'),
                          },
                          {
                            value: TaxRegime.NORMAL,
                            label: t('normalOption'),
                          },
                        ]}
                        dataCy="Taxegime"
                        labelV2="Taxregime"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>
                  </div>
                </div>

                <div className="ch-spaceStackGroup--s">
                  <h2 className="ch-title">
                    {t('addressLabel')}
                  </h2>

                  <div className="ch-fieldGroup ch-fieldGroup--2Tablet">
                    <div className="ch-field">
                      <InputChameleon
                        label={t('zipCodeLabel')}
                        required={false}
                        value={zipCode}
                        mode="text"
                        onChange={onZipCodeChange}
                        dataCy="ZipCode"
                        labelV2="ZipCode"
                        errors={errors}
                        onKeyUp={zipCodeKeyUp}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>

                    <div className="ch-field">
                      <InputChameleon
                        label={t('streetLabel')}
                        required={false}
                        value={street}
                        mode="text"
                        onChange={(e) =>
                          setStreet(e.target.value)
                        }
                        dataCy="Street"
                        labelV2="Street"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>

                    <div className="ch-field">
                      <InputChameleon
                        label={t('numberLabel')}
                        required={false}
                        value={number}
                        mode="text"
                        onChange={(e) =>
                          setNumber(e.target.value)
                        }
                        dataCy="Number"
                        labelV2="Number"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>
                    <div className="ch-field">
                      <InputChameleon
                        label={t('complementLabel')}
                        required={false}
                        value={complement}
                        mode="text"
                        onChange={(e) =>
                          setComplement(e.target.value)
                        }
                        dataCy="Complement"
                        labelV2="Complement"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>
                    <div className="ch-field">
                      <InputChameleon
                        label={t('neighborhoodLabel')}
                        required={false}
                        value={neighborhood}
                        mode="text"
                        onChange={(e) =>
                          setNeighborhood(e.target.value)
                        }
                        dataCy="Neighborhood"
                        labelV2="Neighborhood"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>
                    <div className="ch-field">
                      <InputChameleon
                        label={t('cityLabel')}
                        required={false}
                        value={city}
                        mode="text"
                        onChange={(e) =>
                          setCity(e.target.value)
                        }
                        dataCy="City"
                        labelV2="City"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>
                    <div className="ch-field">
                      <InputChameleon
                        label={t('cityCodeLabel')}
                        required={false}
                        value={cityCode}
                        mode="text"
                        onChange={(e) =>
                          setCityCode(e.target.value)
                        }
                        dataCy="CityCode"
                        labelV2="CityCode"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>
                    <InputChameleon
                      label={t('stateLabel')}
                      required={false}
                      value={state}
                      onChange={(e) =>
                        setState(e.target.value)
                      }
                      mode="select"
                      options={states?.map(
                        (actualState) => ({
                          label: actualState.code,
                          value: actualState.code,
                        })
                      )}
                      dataCy="State"
                      labelV2="State"
                      errors={errors}
                      setErrors={(
                        errorsFilter: IErrorsGraphql[]
                      ) => setErrors(errorsFilter)}
                    />
                    <div className="ch-field">
                      <InputChameleon
                        label={t('latitudeLabel')}
                        required={false}
                        value={latitude}
                        mode="text"
                        onChange={(e) =>
                          setLatitude(e.target.value)
                        }
                        dataCy="Latitude"
                        labelV2="Latitude"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>
                    <div className="ch-field">
                      <InputChameleon
                        label={t('longitudeLabel')}
                        required={false}
                        value={longitude}
                        mode="text"
                        onChange={(e) =>
                          setLongitude(e.target.value)
                        }
                        dataCy="Longitude"
                        labelV2="Longitude"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>
                  </div>
                </div>

                <div className="ch-spaceStackGroup--s">
                  <h2 className="ch-title">
                    {t('tributationLabel')}
                  </h2>

                  <div className="ch-fieldGroup ch-fieldGroup--2Tablet">
                    <div className="ch-field">
                      <InputChameleon
                        type="number"
                        label={t('emitesIdLabel')}
                        required
                        value={emitesId}
                        mode="text"
                        onChange={(e) => {
                          setEmitesId(e.target.value);
                        }}
                        dataCy="EmitesId"
                        labelV2="EmitesId"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>

                    <div className="ch-field">
                      <InputChameleon
                        label={t('serieNfeLabel')}
                        required
                        value={serieNfe}
                        mode="text"
                        onChange={(e) =>
                          setSerieNfe(e.target.value)
                        }
                        dataCy="Serienfe"
                        labelV2="Serienfe"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>

                    <div className="ch-field">
                      <InputChameleon
                        label={t('taxRegimeLabel')}
                        required
                        value={taxRegime}
                        mode="text"
                        onChange={(e) =>
                          setTaxRegime(e.target.value)
                        }
                        dataCy="Taxregime"
                        labelV2="Taxregime"
                        errors={errors}
                        setErrors={(
                          errorsFilter: IErrorsGraphql[]
                        ) => setErrors(errorsFilter)}
                      />
                    </div>
                  </div>
                </div>

                <div className="ch-spaceStackGroup--s">
                  <h2 className="ch-title">
                    {t('additionalConfigLabel')}
                  </h2>
                  <div className="field boolean optional organization_use_average_cost ui checkbox">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={useAverageCost}
                          onChange={(e) =>
                            setUseAverageCost(
                              e.target.checked
                            )
                          }
                          color="primary"
                        />
                      }
                      label={t('useAverageCostLabel')}
                    />
                  </div>
                </div>

                {id && aquisitionChannels && (
                  <div className="ch-spaceStackGroup--s">
                    <h2 className="ch-title">
                      {t('aquisitionChannelLabel')}
                    </h2>
                    <div className="cch-grid-column--4 ch-grid-column--8Desktop">
                      {aquisitionChannels?.map(
                        (channel) => {
                          const isChecked =
                            customerAquisitionChannels.find(
                              (customer) =>
                                channel.id === customer.id
                            );

                          return (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={!!isChecked}
                                  onChange={() => {
                                    onChangeChannel(
                                      channel
                                    );
                                  }}
                                  color="primary"
                                />
                              }
                              label={channel.name}
                            />
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                <div
                  className="ch-spaceInlineGroup--s"
                  style={{ marginTop: '2rem' }}
                >
                  <ButtonChameleon
                    dataTestId="btn-createOrEditOrganization"
                    label={
                      id
                        ? t('editOrgLabel')
                        : t('newOrgLabel')
                    }
                    primary
                    icon={false}
                    onClick={
                      id
                        ? handleUpdateOrganizationsSubmit
                        : handleCreateOrganizationsSubmit
                    }
                  />
                  <ButtonChameleon
                    dataTestId="btn-createOrEditOrganization-cancel"
                    label={t('cancelLabel')}
                    outline
                    icon={false}
                    onClick={handleCancel}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </Content>
    </>
  );
}
