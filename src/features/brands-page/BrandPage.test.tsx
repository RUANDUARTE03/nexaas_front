import React from 'react';
import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { mockStore } from '../../utils/tests';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import Router from 'next/router';
import BrandPage from '.';
import { ALL_BRANDS } from '../../graphql/queries/brands';

const mocks = [
  {
    request: {
      query: ALL_BRANDS,
    },
    result: {
      data: {
        productBrands: [
          {
            id: '1',
            name: 'Apple',
            manufacturer: {
              id: '1',
              name: 'Foxconn Brasil',
            },
          },
          {
            id: '2',
            name: 'ASUS',
            manufacturer: {
              id: '2',
              name: 'ASUS da Amazonia S/A',
            },
          },
        ],
      },
    },
  },
];

jest.mock('next/router', () => ({ push: jest.fn() }));

type brandProps = {
  mockStoreProvider: ReturnType<typeof mockStore>;
  mocksByAction: any;
};

function renderBrand({
  mockStoreProvider,
  mocksByAction,
}: brandProps) {
  return render(
    <Provider store={mockStoreProvider}>
      <MockedProvider
        mocks={mocksByAction}
        addTypename={false}
      >
        <BrandPage />
      </MockedProvider>
    </Provider>
  );
}

describe('Test Brand feature', () => {
  it('Should render correctly', () => {
    renderBrand({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });
  });

  it('Should show loading', () => {
    const wrapper = renderBrand({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    expect(
      wrapper.getByTestId('container-loading-data')
    ).toBeInTheDocument();
  });

  it('Should show mock', async () => {
    const wrapper = renderBrand({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    wrapper.getByText('Apple');
  });

  it('Should show modal when click in btn delete', async () => {
    const wrapper = renderBrand({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    userEvent.click(
      wrapper.getAllByTestId('btn-delete-brand')[0]
    );

    await wrapper.findAllByTestId('container-delete-modal');

    userEvent.click(
      wrapper.getByTestId('btn-action-close-modal')
    );
  });

  it('Should redirect for screen create brand', async () => {
    const wrapper = renderBrand({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    userEvent.click(
      wrapper.getByTestId('btn-create-brand')
    );

    expect(Router.push).toHaveBeenCalledWith(
      '/brands/create/'
    );
  });
});
