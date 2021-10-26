import React from 'react';
import { render, act } from '@testing-library/react';
import ProviderScreen from './providerScreen';
import { Provider } from 'react-redux';
import { mockStore } from '../../utils/tests';
import { MockedProvider } from '@apollo/client/testing';
import { ALL_PROVIDERS } from '../../graphql/queries/providers';
import userEvent from '@testing-library/user-event';
import Router from 'next/router';

const mocks = [
  {
    request: {
      query: ALL_PROVIDERS,
    },
    result: {
      data: {
        providers: [
          {
            id: '2',
            document: '52723924000110',
            name: 'Correios LTDA.',
            tradingName: 'Correios',
            providerType: 'distributor',
          },
          {
            id: '1',
            document: '70585034001',
            name: 'Dufry do Brasil Duty Free Shop LTDA.',
            tradingName: 'Duty Free Shop',
            providerType: 'distributor',
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

function renderProvider({
  mockStoreProvider,
  mocksByAction,
}: providerProps) {
  return render(
    <Provider store={mockStoreProvider}>
      <MockedProvider
        mocks={mocksByAction}
        addTypename={false}
      >
        <ProviderScreen />
      </MockedProvider>
    </Provider>
  );
}

describe('Test feature Provider', () => {
  it('Should render correctly', () => {
    renderProvider({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });
  });

  it('Should show loading', () => {
    const wrapper = renderProvider({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    expect(
      wrapper.getByTestId('container-loading-data')
    ).toBeInTheDocument();
  });

  it('Should show mock', async () => {
    const wrapper = renderProvider({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    wrapper.getByText('Correios LTDA.');
    wrapper.getByText('Correios');
    await wrapper.findAllByText('distributor');
  });

  it('Should show document formatted', async () => {
    const wrapper = renderProvider({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    wrapper.getByText('52.723.924/0001-10');
    wrapper.getByText('705.850.340-01');
  });

  it('Should show modal when click in btn delete', async () => {
    const wrapper = renderProvider({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    userEvent.click(
      wrapper.getAllByTestId('btn-delete-provider')[0]
    );

    await wrapper.findAllByTestId('container-delete-modal');
    wrapper.getByText('Remover fornecedor');

    userEvent.click(
      wrapper.getByTestId('btn-action-close-modal')
    );
  });

  it('Should redirect for screen create provider', async () => {
    const wrapper = renderProvider({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    userEvent.click(
      wrapper.getByTestId('btn-create-provider')
    );

    expect(Router.push).toHaveBeenCalledWith(
      '/providers/create/'
    );
  });
});
