import React from 'react';
import { render, act } from '@testing-library/react';
import ProfileMenu from './ProfileMenu';
import { Provider } from 'react-redux';
import { mockStore } from '../../../utils/tests';
import { MockedProvider } from '@apollo/client/testing';
import { GET_SESSION_PROFILE } from '../../../graphql/queries/session';
import userEvent from '@testing-library/user-event';
import Router from 'next/router';

type ProfileMenuProps = {
  mockStoreProvider: ReturnType<typeof mockStore>;
  mockByType: any;
};

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

const mockError = [
  {
    request: {
      query: GET_SESSION_PROFILE,
    },
    error: new Error('An error occurred'),
  },
];

function renderProfileMenu({
  mockStoreProvider,
  mockByType,
}: ProfileMenuProps) {
  return render(
    <Provider store={mockStoreProvider}>
      <MockedProvider
        mocks={mockByType}
        addTypename={false}
      >
        <ProfileMenu />
      </MockedProvider>
    </Provider>
  );
}

describe('Test StoreMenu component', () => {
  it('Should render correctly', () => {
    renderProfileMenu({
      mockStoreProvider: mockStore(),
      mockByType: mock,
    });
  });

  it('Should render loading', () => {
    const wrapper = renderProfileMenu({
      mockStoreProvider: mockStore(),
      mockByType: mock,
    });

    expect(
      wrapper.getByTestId('container-spinner')
    ).toBeInTheDocument();
  });

  it('Should error when failed request', async () => {
    const wrapper = renderProfileMenu({
      mockStoreProvider: mockStore(),
      mockByType: mockError,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    wrapper.getByText(
      'Ocorreu um erro inesperado, tente novamente mais tarde'
    );
  });

  it('Should render data correctly', async () => {
    const wrapper = renderProfileMenu({
      mockStoreProvider: mockStore(),
      mockByType: mock,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    expect(
      wrapper.getByTestId('container-profile-menu')
    ).toBeInTheDocument();
    wrapper.getByText('fullName');
    wrapper.getByText('fulano@nexaas.com');
  });
});
