import React from 'react';
import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { mockStore } from '../../../utils/tests';
import {
  GET_BRAND,
  CREATE_BRAND,
} from '../../../graphql/queries/brands';
import CreateOrEditBrand from '.';

jest.mock(
  '../../../components/Chameleon/input-chameleon/InputChameleon',
  () => (props: any) => <input type="text" {...props} />
);

function mockByEdit() {
  jest
    .spyOn(require('next/router'), 'useRouter')
    .mockImplementation(() => ({
      route: '/product_brands',
      pathname: '',
      query: { id: 1 },
      asPath: '',
      push: jest.fn(),
    }));
}

const mocks = [
  {
    request: {
      query: GET_BRAND,
      variables: { id: 1 },
    },
    result: {
      data: {
        productBrand: {
          id: 1,
          name: 'Brand Teste Library',
          manufacturer: {
            id: 1,
            name: 'Manufacturer test brand',
          },
        },
      },
    },
  },
];

const mockCreate = [
  {
    request: {
      query: CREATE_BRAND,
    },
    result: {
      data: {
        productBrand: {
          document,
        },
      },
    },
  },
];

const mockError = [
  {
    request: {
      query: GET_BRAND,
      variables: { id: 1 },
    },
    error: new Error('An error occurred'),
  },
];

type IProps = {
  mockStoreProvider: ReturnType<typeof mockStore>;
  mocksByAction: any;
};

function renderBrandCreateOrEdit({
  mockStoreProvider,
  mocksByAction,
}: IProps) {
  return render(
    <Provider store={mockStoreProvider}>
      <MockedProvider
        mocks={mocksByAction}
        addTypename={false}
      >
        <CreateOrEditBrand />
      </MockedProvider>
    </Provider>
  );
}

describe('Test feature Brands', () => {
  it.each([
    [1, 'edit'],
    [null, 'create'],
  ])(
    'Should render correctly mode %s',
    async (query, mode) => {
      jest
        .spyOn(require('next/router'), 'useRouter')
        .mockImplementation(() => ({
          route: '/product_brands',
          pathname: '',
          query: { id: query },
          asPath: '',
          push: jest.fn(),
        }));

      const wrapper = renderBrandCreateOrEdit({
        mockStoreProvider: mockStore(),
        mocksByAction:
          mode === 'create' ? mockCreate : mocks,
      });

      await act(async () => {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000)
        );
      });

      wrapper.getAllByText(
        `${
          mode === 'edit'
            ? 'editBrandLabel'
            : 'newBrandLabel'
        }`
      )[0];
    }
  );
  it('Should show loading', () => {
    jest
      .spyOn(require('next/router'), 'useRouter')
      .mockImplementation(() => ({
        route: '/product_brands',
        pathname: '',
        query: { id: 1 },
        asPath: '',
        push: jest.fn(),
      }));
    const wrapper = renderBrandCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });
    expect(
      wrapper.getByTestId('container-loading-data')
    ).toBeInTheDocument();
  });
  it('Should call redirect for brand when click in cancel', async () => {
    jest
      .spyOn(require('next/router'), 'useRouter')
      .mockImplementation(() => ({
        route: '/product_brands',
        pathname: '',
        query: { id: 1 },
        asPath: '',
        push: jest.fn(),
      }));
    const wrapper = renderBrandCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });
    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });
    userEvent.click(
      wrapper.getByTestId('btn-createOrEditBrand-cancel')
    );
  });
  it('Should read in all inputs and formatters', async () => {
    jest
      .spyOn(require('next/router'), 'useRouter')
      .mockImplementation(() => ({
        route: '/product_brands',
        pathname: '',
        query: { id: 1 },
        asPath: '',
        push: jest.fn(),
      }));
    const wrapper = renderBrandCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });
    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });
    ['Brand Teste Library'].map((el) => {
      expect(
        wrapper.getAllByDisplayValue(el)[0]
      ).toBeDefined();
    });
  });
  it('Should show error in organization', async () => {
    jest
      .spyOn(require('next/router'), 'useRouter')
      .mockImplementation(() => ({
        route: '/product_brands',
        pathname: '',
        query: { id: 1 },
        asPath: '',
        push: jest.fn(),
      }));
    const wrapper = renderBrandCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mockError,
    });
    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });
    expect(
      wrapper.getByTestId('container-error-data')
    ).toBeInTheDocument();
  });
});
