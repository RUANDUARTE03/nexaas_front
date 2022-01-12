import { gql } from '@apollo/client';

const ALL_MANUFACTURERS = gql`
  {
    manufacturers {
      id
      name
    }
  }
`;

export { ALL_MANUFACTURERS };
