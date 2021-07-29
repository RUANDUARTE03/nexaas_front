import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { routes } from '../../../utils/routes';
import Header from '../../../components/header';

import Styles from './createOrEditProvider.module.scss';
import BtnActionsCrud from '../../../components/btnActionsCrud/btnActionsCrud';
import {
  CREATE_PROVIDER,
  GET_PROVIDER,
  UPDATE_PROVIDER,
} from '../../../graphql/queries/providers';

export default function CreateProvider() {
  const router = useRouter();
  const { id } = router.query;
  const [errors, setErrors] = useState([]);
  const [identifier, setIdentifier] = useState<string>('');
  const [errorIdentifier, setErroIdentifier] =
    useState<boolean>(false);
  const [companyName, setCompanyName] =
    useState<string>('');
  const [fantasyName, setFantasyName] =
    useState<string>('');
  const [typeProvider, setTypeProvider] =
    useState<string>();
  const [indicatorSign, setIndicatorSign] =
    useState<number>();
  const [identifierExternal, setIdentifierExternal] =
    useState<string>('');

  // Init Logic For Create Provider
  const [createProvider] = useMutation(CREATE_PROVIDER, {
    onCompleted: (response) => {
      const { errors: errorsCreate } =
        response.createProvider;

      if (!errorsCreate.length) {
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
      setIdentifier(dataGet.provider.document);
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
    }
  }, [dataGet]);

  const [updateProvider] = useMutation(UPDATE_PROVIDER, {
    onCompleted: (response) => {
      const { errors: errorsEdit } =
        response.updateProvider;

      if (!errorsEdit.length) {
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
        },
      },
    });
  };

  // Finish Logic For Edit Provider

  const resetForm = () => {
    setIdentifier('');
    setErroIdentifier(false);
    setCompanyName('');
    setFantasyName('');
    setTypeProvider(undefined);
    setIndicatorSign(undefined);
    setIdentifierExternal('');
  };

  const onChangeIdentifier = (e: any) => {
    const event = e.target.value;

    if (event.length <= 11) {
      setIdentifier(
        event.replace(
          /(\d{3})(\d{3})(\d{3})(\d{2})/g,
          '$1.$2.$3-$4'
        )
      );
    } else if (event.length === 14) {
      setIdentifier(
        event.replace(
          /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
          '$1.$2.$3/$4-$5'
        )
      );
    } else {
      // eslint-disable-next-line no-useless-escape
      setIdentifier(event.replace(/(\.|\/|\-)/g, ''));
    }

    if (cpf.isValid(event) || cnpj.isValid(event)) {
      setErroIdentifier(false);
    } else {
      setErroIdentifier(true);
    }
  };

  if (errorsGetProvider && id) {
    return <h1>Screen errors</h1>;
  }

  // only get provider
  if (loadingGetProvider) {
    return <h1>Screen loading</h1>;
  }

  return (
    <div className={Styles.containerForm}>
      <Header
        navigation={[
          {
            title: 'Fornecedores',
            link: routes.providers.index,
          },
          {
            title: `${
              id ? 'Editar Fornecedor' : 'Novo Fornecedor'
            }`,
          },
        ]}
      />
      <Typography variant="h4">
        {`${id ? 'Editar Fornecedor' : 'Novo Fornecedor'}`}
      </Typography>
      <TextField
        label="CPF/CNPJ"
        id="outlined-margin-none"
        variant="outlined"
        className={Styles.inputIdentifier}
        value={identifier}
        onChange={(e) => {
          onChangeIdentifier(e);
        }}
        error={errorIdentifier || errors.length > 0}
        helperText={errors
          .filter((x) => x.includes('CNPJ/CPF'))
          .map((x) => (
            <>
              {x}
              <br />
            </>
          ))}
        onBlur={() => {
          identifier.length === 0
            ? setErroIdentifier(false)
            : null;
        }}
      />
      <div className={Styles.wrapperInput}>
        <TextField
          label="Razão Social/Nome"
          id="outlined-margin-none"
          variant="outlined"
          className={Styles.inputCompanyName}
          value={companyName}
          onChange={(e) => {
            setCompanyName(e.target.value);
          }}
          error={errors.length > 0}
          helperText={errors
            .filter((x) => x.includes('Social/Nome'))
            .map((x) => (
              <>
                {x}
                <br />
              </>
            ))}
        />
        <TextField
          label="Nome Fantasia"
          id="outlined-margin-none"
          variant="outlined"
          className={Styles.inputFantasyName}
          value={fantasyName}
          onChange={(e) => {
            setFantasyName(e.target.value);
          }}
        />
      </div>
      <div className={Styles.wrapperInput}>
        <FormControl
          variant="outlined"
          className={Styles.inputTypeProvider}
        >
          <InputLabel htmlFor="outlined-age-native-simple">
            Tipo de Fonecedor
          </InputLabel>
          <Select
            native
            label="Tipo de Fonecedor"
            value={typeProvider}
            onChange={(e) => {
              setTypeProvider(e.target.value.toString());
            }}
          >
            <option aria-label="None" value="" />
            <option value="Transportadora">
              Transportadora
            </option>
            <option value="Distribuidora">
              Distribuidora
            </option>
          </Select>
        </FormControl>
        <FormControl
          variant="outlined"
          className={Styles.inputTypeProvider}
        >
          <InputLabel htmlFor="outlined-age-native-simple">
            Indicador Inscrição Estadual
          </InputLabel>
          <Select
            native
            label="Indicador Inscrição Estadual"
            value={indicatorSign}
            onChange={(e) => {
              setIndicatorSign(Number(e.target.value));
            }}
          >
            <option aria-label="None" value="" />
            <option value={1}>1: Contribuinte ICMS</option>
            <option value={2}>
              2: Contribuinte Isento
            </option>
            <option value={9}>9: Não Contribuinte</option>
          </Select>
        </FormControl>
      </div>
      <TextField
        label="ID Externo"
        id="outlined-margin-none"
        variant="outlined"
        className={Styles.inputID}
        value={identifierExternal}
        onChange={(e) => {
          setIdentifierExternal(e.target.value);
        }}
      />
      <BtnActionsCrud
        mode={`${id ? 'edit' : 'create'}`}
        title="Fornecedor"
        routerCancel={routes.providers.index}
        cancel={resetForm}
        action={
          id
            ? handleSubmitEditProvider
            : handleSubmitCreateProvider
        }
      />
    </div>
  );
}
