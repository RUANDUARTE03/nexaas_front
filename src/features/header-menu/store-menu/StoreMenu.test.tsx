import React from 'react';
import { render, act } from '@testing-library/react';
import StoreMenu from './StoreMenu';
import { Provider } from 'react-redux';
import { mockStore } from '../../../utils/tests';
import { MockedProvider } from '@apollo/client/testing';

jest.mock('next/image', () => (props: any) => (
  <img {...props} />
));

type StoreMenuProps = {
  mockStoreProvider: ReturnType<typeof mockStore>;
};

function renderStoreMenu({
  mockStoreProvider,
}: StoreMenuProps) {
  return render(
    <Provider store={mockStoreProvider}>
      <MockedProvider mocks={[]} addTypename={false}>
        <StoreMenu />
      </MockedProvider>
    </Provider>
  );
}

describe('Test StoreMenu component', () => {
  it('Should render correctly', () => {
    renderStoreMenu({
      mockStoreProvider: mockStore(),
    });
  });

  it('Should render all options', () => {
    const wrapper = renderStoreMenu({
      mockStoreProvider: mockStore(),
    });

    wrapper.getByText('Myfinance');
    wrapper.getByText('Analytics');
    wrapper.getByText('PDVend');
    wrapper.getByText('Emites');
    wrapper.getByText('Cobrato');
  });

  it('Should render all descriptions', () => {
    const wrapper = renderStoreMenu({
      mockStoreProvider: mockStore(),
    });

    wrapper.getByText('Gestão Financeira');
    wrapper.getByText('Inteligência de Dados');
    wrapper.getByText('Vendas Móveis');
    wrapper.getByText('Gestão Tributária');
    wrapper.getByText('Meios de Pagamento');
  });

  it.each([
    [0, 'https://sandbox.conta.fintera.com.br/'],
    [1, 'https://homologation.analytics.nexaas.com/'],
    [2, 'https://app.qa.plug-and-play.pdvend.com.br/'],
    [3, 'https://app.homologation.emites.com.br/'],
    [4, 'https://sandbox.cobrato.com'],
  ])('Should render attributes correctly', (id, link) => {
    const wrapper = renderStoreMenu({
      mockStoreProvider: mockStore(),
    });

    const linkById = wrapper.getAllByRole('link')[id];

    expect(linkById).toHaveAttribute('href', link);
  });
});
