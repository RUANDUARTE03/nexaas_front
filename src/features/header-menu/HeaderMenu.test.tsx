import React from 'react';
import { render } from '@testing-library/react';
import HeaderMenu from './HeaderMenu';
import { Provider } from 'react-redux';
import { mockStore } from '../../utils/tests';
import { MockedProvider } from '@apollo/client/testing';
import { GET_SESSION_PROFILE } from '../../graphql/queries/session';

const mock = [
  {
    request: {
      query: GET_SESSION_PROFILE,
    },
    result: {
      data: {
        session: {
          profile: {
            fullName: 'fullName',
            email: 'fulano@nexaas.com',
            picture: 'token',
          },
        },
      },
    },
  },
];

type HeaderMenuProps = {
  breadcumb: string;
  mockStoreProvider: ReturnType<typeof mockStore>;
  mocksByAction: any;
};

function renderHeaderMenu({
  mockStoreProvider,
  breadcumb,
  mocksByAction,
}: HeaderMenuProps) {
  return render(
    <Provider store={mockStoreProvider}>
      <MockedProvider
        mocks={mocksByAction}
        addTypename={false}
      >
        <HeaderMenu breadcumb={breadcumb} />
      </MockedProvider>
    </Provider>
  );
}

describe('Test HeaderMenu component', () => {
  it('Should render correctly', () => {
    renderHeaderMenu({
      mockStoreProvider: mockStore(),
      mocksByAction: mock,
      breadcumb: 'breadcumb',
    });
  });
});
