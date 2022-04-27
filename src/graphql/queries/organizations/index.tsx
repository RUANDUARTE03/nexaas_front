import { gql } from '@apollo/client';

const ALL_ORGANIZATIONS = gql`
  {
    organizations {
      id
      name
      cnpj
    }
  }
`;

const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization(
    $input: CreateOrganizationInput!
  ) {
    createOrganization(input: $input) {
      organization {
        name
      }
      errors {
        code
        message
        path
      }
      success
    }
  }
`;

const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization(
    $input: UpdateOrganizationInput!
  ) {
    updateOrganization(input: $input) {
      organization {
        id
      }
      errors {
        code
        message
        path
      }
      success
    }
  }
`;

const CHANGE_CURRENT_ORGANIZATION = gql`
  mutation ChangeOrganization(
    $input: ChangeOrganizationInput!
  ) {
    changeOrganization(input: $input) {
      organization {
        id
      }
      errors {
        code
        message
        path
      }
      success
    }
  }
`;

const DELETE_ORGANIZATION = gql`
  mutation deleteOrganization(
    $input: DeleteOrganizationInput!
  ) {
    deleteOrganization(input: $input) {
      organization {
        id
      }
      errors {
        code
        message
        path
      }
      success
    }
  }
`;

const GET_ORGANIZATION = gql`
  query GetOrganization($id: ID!) {
    organization(id: $id) {
      averageWithdrawalPrice
      averageWithdrawalTerm
      city
      cityCode
      cnpj
      companyName
      complement
      deliveryRadiusMax
      emitesId
      id
      kind
      latitude
      longitude
      name
      neighborhood
      number
      serieNfe
      state
      stateRegistration
      street
      taxRegime
      useAverageCost
      zipCode
      aquisitionChannels {
        id
        name
      }
      customerAquisitionChannels {
        id
        name
      }
    }
  }
`;

export {
  GET_ORGANIZATION,
  ALL_ORGANIZATIONS,
  DELETE_ORGANIZATION,
  CREATE_ORGANIZATION,
  UPDATE_ORGANIZATION,
  CHANGE_CURRENT_ORGANIZATION,
};
