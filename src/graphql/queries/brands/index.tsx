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

const DELETE_BRAND = gql`
  mutation deleteBrands($input: DeleteProductBrandInput!) {
    deleteProductBrand(input: $input) {
      success
      errors
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
      errors {
        code
        message
        path
      }
      success
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
      errors {
        code
        message
        path
      }
      success
    }
  }
`;

export {
  ALL_BRANDS,
  GET_BRAND,
  CREATE_BRAND,
  UPDATE_BRAND,
  DELETE_BRAND,
};
