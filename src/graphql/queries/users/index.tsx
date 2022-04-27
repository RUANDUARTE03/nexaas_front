import { gql } from '@apollo/client';

const ALL_ORGANIZATION = gql`
  {
    users {
      id
      name
      email
      role
    }
  }
`;

const GET_USER = gql`
  query getUser($id: ID!) {
    user(id: $id) {
      id
      email
      role
      organizationIds
    }
  }
`;

const CREATE_ORGANIZATION = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        email
        role
        organizationIds
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
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
        id
        email
        role
        organizationIds
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
  mutation deleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      user {
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

export {
  ALL_ORGANIZATION,
  GET_USER,
  CREATE_ORGANIZATION,
  UPDATE_ORGANIZATION,
  DELETE_ORGANIZATION,
};
