import { gql } from '@apollo/client';

const ALL_MANUFACTURERS = gql`
  {
    manufacturers {
      id
      name
    }
  }
`;

const CREATE_MANUFACTURER = gql`
  mutation CreateManufacturer(
    $input: CreateManufacturerInput!
  ) {
    createManufacturer(input: $input) {
      manufacturer {
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

const UPDATE_MANUFACTURER = gql`
  mutation UpdateManufacturer(
    $input: UpdateManufacturerInput!
  ) {
    updateManufacturer(input: $input) {
      manufacturer {
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

const DELETE_MANUFACTURER = gql`
  mutation DeleteManufacturer(
    $input: DeleteManufacturerInput!
  ) {
    deleteManufacturer(input: $input) {
      manufacturer {
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

const GET_MANUFACTURER = gql`
  query GetManufacturer($id: ID!) {
    manufacturer(id: $id) {
      id
      name
    }
  }
`;

export {
  ALL_MANUFACTURERS,
  CREATE_MANUFACTURER,
  DELETE_MANUFACTURER,
  GET_MANUFACTURER,
  UPDATE_MANUFACTURER,
};
