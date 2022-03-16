import { gql } from '@apollo/client';

const ALL_PROVIDERS = gql`
  {
    providers {
      id
      document
      name
      tradingName
      providerType
    }
  }
`;

const GET_PROVIDER = gql`
  query GetProvider($id: ID!) {
    provider(id: $id) {
      id
      document
      name
      tradingName
      stateInscriptionType
      providerType
      externalId
      street
      number
      detail
      zipcode
      neighborhood
      cityCode
      city
      state
      country
      stateInscription
    }
  }
`;

const CREATE_PROVIDER = gql`
  mutation CreateProvider($input: CreateProviderInput!) {
    createProvider(input: $input) {
      provider {
        document
        name
        tradingName
        stateInscriptionType
        providerType
        externalId
        street
        number
        detail
        zipcode
        neighborhood
        cityCode
        city
        state
        country
        stateInscription
      }
      success
      errors
    }
  }
`;

const UPDATE_PROVIDER = gql`
  mutation UpdateProvider($input: UpdateProviderInput!) {
    updateProvider(input: $input) {
      provider {
        id
        document
        name
        tradingName
        stateInscriptionType
        providerType
        externalId
        street
        number
        detail
        zipcode
        neighborhood
        cityCode
        city
        state
        country
        stateInscription
      }
      errors
      success
    }
  }
`;

const DELETE_PROVIDER = gql`
  mutation deleteProvider($input: DeleteProviderInput!) {
    deleteProvider(input: $input) {
      success
      errors
    }
  }
`;
export {
  ALL_PROVIDERS,
  GET_PROVIDER,
  CREATE_PROVIDER,
  UPDATE_PROVIDER,
  DELETE_PROVIDER,
};
