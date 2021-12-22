import React from 'react';
import { render, act } from '@testing-library/react';
import OrganizationPage from './OrganizationPage';
import { Provider } from 'react-redux';
import { mockStore } from '../../utils/tests';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import Router from 'next/router';
import { ALL_ORGANIZATIONS } from '../../graphql/queries/organizations';

const mocks = [
  {
    request: {
      query: ALL_ORGANIZATIONS,
    },
    result: {
      data: {
        organizations: [
          {
            id: '1',
            name: 'Loja 123',
            cnpj: '55492986000156',
          },
          {
            id: '2',
            name: 'Zeenow - Botafogo',
            cnpj: '96833622000170',
          },
        ],
      },
    },
  },
];

jest.mock('next/router', () => ({ push: jest.fn() }));

type providerProps = {
  mockStoreProvider: ReturnType<typeof mockStore>;
  mocksByAction: any;
};

function renderOrganization({
  mockStoreProvider,
  mocksByAction,
}: providerProps) {
  return render(
    <Provider store={mockStoreProvider}>
      <MockedProvider
        mocks={mocksByAction}
        addTypename={false}
      >
        <OrganizationPage />
      </MockedProvider>
    </Provider>
  );
}

describe('Test Organization feature', () => {
  it('Should render correctly', () => {
    renderOrganization({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });
  });

  it('Should show loading', () => {
    const wrapper = renderOrganization({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    expect(
      wrapper.getByTestId('container-loading-data')
    ).toBeInTheDocument();
  });

  it('Should show mock', async () => {
    const wrapper = renderOrganization({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    wrapper.getByText('Loja 123');
  });

  it('Should show cnpj formatted', async () => {
    const wrapper = renderOrganization({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    wrapper.getByText('55.492.986/0001-56');
    wrapper.getByText('96.833.622/0001-70');
  });

  it('Should show modal when click in btn delete', async () => {
    const wrapper = renderOrganization({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    userEvent.click(
      wrapper.getAllByTestId('btn-delete-organization')[0]
    );

    await wrapper.findAllByTestId('container-delete-modal');

    userEvent.click(
      wrapper.getByTestId('btn-action-close-modal')
    );
  });

  it('Should redirect for screen create organization', async () => {
    const wrapper = renderOrganization({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    userEvent.click(
      wrapper.getByTestId('btn-create-organization')
    );

    expect(Router.push).toHaveBeenCalledWith(
      '/organizations/create/'
    );
  });
});
