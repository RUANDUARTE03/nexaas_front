import { gql } from '@apollo/client';

const ALL_BRANDS = gql`
  {
    productBrands {
      id
      name
      manufacturer {
        id
        name
      }
    }
  }
`;

const GET_BRAND = gql`
  query GetProductBrand($id: ID!) {
    productBrand(id: $id) {
      id
      name
      manufacturer {
        id
        name
      }
    }
  }
`;

const CREATE_BRAND = gql`
  mutation CreateProductBrand(
    $input: CreateProductBrandInput!
  ) {
    createProductBrand(input: $input) {
      productBrand {
        name
        manufacturerId
      }
      errors
    }
  }
`;

const UPDATE_BRAND = gql`
  mutation UpdateProductBrand(
    $input: UpdateProductBrandInput!
  ) {
    updateProductBrand(input: $input) {
      productBrand {
        id
        name
        manufacturerId
      }
      errors
    }
  }
`;

export {
  ALL_BRANDS,
  GET_BRAND,
  CREATE_BRAND,
  UPDATE_BRAND,
};
