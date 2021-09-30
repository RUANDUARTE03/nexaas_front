import { gql } from '@apollo/client';

const GET_SESSION_PROFILE = gql`
  query getSessionProfile {
    session {
      profile {
        fullName
        email
        picture
      }
    }
  }
`;

export { GET_SESSION_PROFILE };
