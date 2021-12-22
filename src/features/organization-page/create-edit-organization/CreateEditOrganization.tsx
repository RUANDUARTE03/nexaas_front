/* eslint-disable react/jsx-curly-newline */
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { cnpj as cnpjFormatter } from 'cpf-cnpj-validator';
import { useDispatch } from 'react-redux';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'next-i18next';
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
} from '../../../utils/constants/Organization';
import { states } from '../../../utils/constants/states';
import {
  formatZipCode,
  unformatZipCode,
} from '../../../utils/formatters/zipcode';
import { getAddressByCep } from '../../../services/providerService';
import ButtonChameleon from '../../../components/Chameleon/button-chameleon';
import { formatValueToReal } from '../../../utils/formatters/Currency';
import { submitOrganization } from '../../../store/actions/submitOrganizations';
import HeaderMenu from '../../header-menu';
import Content from '../../../components/content';

/* eslint-disable jsx-a11y/label-has-associated-control */

export default function CreateEditOrganization() {
  const router = useRouter();

  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const { id } = router.query;
  const { t } = useTranslation('create-edit-organization');

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

  const [createOrganization] = useMutation(
    CREATE_ORGANIZATION,
    {
      onCompleted: (response) => {
        const { errors: errorsCreate } =
          response.createOrganization;

        if (!errorsCreate.length) {
          dispatch(submitOrganization({ type: 'create' }));
          router.push(routes.organizations.index);
        } else {
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
    if (zipCode.replace('-', '').length === 8) {
      getAddressByCep(zipCode.replace('-', '')).then(
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
        }
      );
    }
  };

  const handleCreateOrganizationSubmit = () => {
    createOrganization({
      variables: {
        input: {
          name,
          cnpj: cnpj.replace(/[^\d]+/g, ''),
          stateRegistration,
          companyName,
          averageWithdrawalTerm: Number(
            averageWithdrawalTerm
          ),
          averageWithdrawalPrice: Number(
            averageWithdrawalPrice.replace(',', '')
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
  };

  const [updateOrganization] = useMutation(
    UPDATE_ORGANIZATION,
    {
      onCompleted: (response) => {
        const { errors: errorsEdit } =
          response.updateOrganization;

        if (!errorsEdit.length) {
          dispatch(submitOrganization({ type: 'edit' }));
          router.push(routes.organizations.index);
        } else {
          setErrors(errorsEdit);
        }
      },
    }
  );

  const handleUpdateOrganizationSubmit = () => {
    updateOrganization({
      variables: {
        input: {
          id,
          name,
          cnpj: cnpj.replace(/[^\d]+/g, ''),
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
        },
      },
    });
  };

  if (errorsGetOrganization && id) {
    return (
      <div data-testid="container-error-data">
        <h1>{t('error')}</h1>
      </div>
    );
  }

  if (loadingGetOrganization) {
    return (
      <div data-testid="container-loading-data">
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

          {errors.length > 0 && (
            <Alert severity="error">
              <AlertTitle>
                {`Erro ao ${
                  id ? 'editar' : 'criar'
                } organização.`}
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
                        onKeyUp={zipCodeKeyUp}
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
                      options={states.map(
                        (actualState) => ({
                          label: actualState.code,
                          value: actualState.code,
                        })
                      )}
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
                      />
                    </div>
                  </div>
                </div>

                <div className="ch-spaceStackGroup--s">
                  <h2 className="ch-title">
                    {t('additionalConfigLabel')}
                  </h2>
                  <div className="field boolean optional organization_use_average_cost ui checkbox">
                    <input
                      type="checkbox"
                      checked={useAverageCost}
                      onChange={(e) =>
                        setUseAverageCost(e.target.checked)
                      }
                      name="use_average_cost"
                      id="use_average_cost"
                    />
                    <label
                      className="boolean optional nowrap"
                      htmlFor="use_average_cost"
                    >
                      {t('useAverageCostLabel')}
                    </label>
                  </div>
                </div>

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
                        ? handleUpdateOrganizationSubmit
                        : handleCreateOrganizationSubmit
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
