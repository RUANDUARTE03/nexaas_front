import { gql } from '@apollo/client';

const GET_SESSION_PROFILE = gql`
  query getSessionProfile {
    session {
      profile {
        fullName
        email
        picture
        logoutPath
      }
    }
  }
`;

const GET_CURRENT_ORGANIZATION = gql`
  query getSessionProfile {
    session {
      organizations {
        id
        current
        name
      }
    }
  }
`;

export { GET_SESSION_PROFILE, GET_CURRENT_ORGANIZATION };
