import { gql } from '@apollo/client';

const ALL_USERS = gql`
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

const CREATE_USER = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        email
        role
        organizationIds
      }
      errors
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
      errors
    }
  }
`;

const DELETE_USER = gql`
  mutation deleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      user {
        id
      }
      errors
    }
  }
`;

export {
  ALL_USERS,
  GET_USER,
  CREATE_USER,
  UPDATE_ORGANIZATION,
  DELETE_USER,
};
