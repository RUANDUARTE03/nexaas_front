import React from 'react';
import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { mockStore } from '../../utils/tests';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import Router from 'next/router';
import { ALL_MANUFACTURERS } from '../../graphql/queries/manufacturers';
import ManufacturerPage from '.';

const mocks = [
  {
    request: {
      query: ALL_MANUFACTURERS,
    },
    result: {
      data: {
        manufacturers: [
          {
            id: '1',
            name: 'Loja 123',
          },
          {
            id: '2',
            name: 'Zeenow - Botafogo',
          },
        ],
      },
    },
  },
];

jest.mock('next/router', () => ({ push: jest.fn() }));

type manufacturerProps = {
  mockStoreProvider: ReturnType<typeof mockStore>;
  mocksByAction: any;
};

function renderManufacturer({
  mockStoreProvider,
  mocksByAction,
}: manufacturerProps) {
  return render(
    <Provider store={mockStoreProvider}>
      <MockedProvider
        mocks={mocksByAction}
        addTypename={false}
      >
        <ManufacturerPage />
      </MockedProvider>
    </Provider>
  );
}

describe('Test Manufacturer feature', () => {
  it('Should render correctly', () => {
    renderManufacturer({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });
  });

  it('Should show loading', () => {
    const wrapper = renderManufacturer({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    expect(
      wrapper.getByTestId('container-loading-data')
    ).toBeInTheDocument();
  });

  it('Should show mock', async () => {
    const wrapper = renderManufacturer({
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

  // it('Should show modal when click in btn delete', async () => {
  //   const wrapper = renderManufacturer({
  //     mockStoreProvider: mockStore(),
  //     mocksByAction: mocks,
  //   });

  //   await act(async () => {
  //     await new Promise((resolve) =>
  //       setTimeout(resolve, 1000)
  //     );
  //   });

  //   userEvent.click(
  //     wrapper.getAllByTestId('btn-delete-manufacturer')[0]
  //   );

  //   await wrapper.findAllByTestId('container-delete-modal');

  //   userEvent.click(
  //     wrapper.getByTestId('btn-action-close-modal')
  //   );
  // });

  it('Should redirect for screen create organization', async () => {
    const wrapper = renderManufacturer({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    userEvent.click(
      wrapper.getByTestId('btn-create-manufacturer')
    );

    expect(Router.push).toHaveBeenCalledWith(
      '/manufacturers/create/'
    );
  });
});
