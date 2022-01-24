import React from 'react';
import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { mockStore } from '../../../utils/tests';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import {
  GET_MANUFACTURER,
  CREATE_MANUFACTURER,
} from '../../../graphql/queries/manufacturers';
import CreateOrEditManufacturers from './createEditManufacturer';

jest.mock(
  '../../../components/Chameleon/input-chameleon/InputChameleon',
  () => (props: any) => <input type="text" {...props} />
);

function mockByEdit() {
  jest
    .spyOn(require('next/router'), 'useRouter')
    .mockImplementation(() => ({
      route: '/manufacturers',
      pathname: '',
      query: { id: 1 },
      asPath: '',
      push: jest.fn(),
    }));
}

const mocks = [
  {
    request: {
      query: GET_MANUFACTURER,
      variables: { id: 1 },
    },
    result: {
      data: {
        manufacturer: {
          id: 1,
          name: 'nameManufacturer',
        },
      },
    },
  },
];

const mockCreate = [
  {
    request: {
      query: CREATE_MANUFACTURER,
    },
    result: {
      data: {
        manufacturer: {
          document,
        },
      },
    },
  },
];

const mockError = [
  {
    request: {
      query: GET_MANUFACTURER,
      variables: { id: 1 },
    },
    error: new Error('An error occurred'),
  },
];

type providerProps = {
  mockStoreProvider: ReturnType<typeof mockStore>;
  mocksByAction: any;
};

function renderManufactuerCreateOrEdit({
  mockStoreProvider,
  mocksByAction,
}: providerProps) {
  return render(
    <Provider store={mockStoreProvider}>
      <MockedProvider
        mocks={mocksByAction}
        addTypename={false}
      >
        <CreateOrEditManufacturers />
      </MockedProvider>
    </Provider>
  );
}

describe('Test feature Manufacturer', () => {
  it.each([
    [1, 'Editar', false],
    [null, 'Criar', true],
  ])(
    'Should render correctly mode %s',
    async (query, mode, create) => {
      jest
        .spyOn(require('next/router'), 'useRouter')
        .mockImplementation(() => ({
          route: '/manufacturers',
          pathname: '',
          query: { id: query },
          asPath: '',
          push: jest.fn(),
        }));

      const wrapper = renderManufactuerCreateOrEdit({
        mockStoreProvider: mockStore(),
        mocksByAction: create ? mockCreate : mocks,
      });

      await act(async () => {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000)
        );
      });

      wrapper.getAllByText(
        `${
          mode === 'Editar'
            ? 'editManufacturer'
            : 'newManufacturer'
        }`
      )[0];
    }
  );

  it('Should show loading', () => {
    mockByEdit();
    const wrapper = renderManufactuerCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    expect(
      wrapper.getByTestId('container-loading-data')
    ).toBeInTheDocument();
  });

  it('Should call redirect for provider when click in cancel', async () => {
    jest
      .spyOn(require('next/router'), 'useRouter')
      .mockImplementation(() => ({
        route: '/manufacturers',
        pathname: '',
        query: { id: 1 },
        asPath: '',
        push: jest.fn(),
      }));

    const wrapper = renderManufactuerCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    userEvent.click(
      wrapper.getByTestId(
        'btn-createOrEditManufacturer-cancel'
      )
    );
  });

  it('Should read in all inputs and formatters', async () => {
    mockByEdit();

    const wrapper = renderManufactuerCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    expect(
      wrapper.getByDisplayValue('nameManufacturer')
    ).toBeDefined();
  });

  it('Should write in all inputs the informations', async () => {
    mockByEdit();

    const wrapper = renderManufactuerCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    [
      {
        NumberRole: 0,
        text: 'Edit',
        expect: 'nameManufacturerEdit',
      },
    ].map((x) => {
      userEvent.type(
        wrapper.getAllByRole('textbox')[x.NumberRole],
        x.text
      );

      expect(
        wrapper.getByDisplayValue(x.expect)
      ).toBeDefined();
    });
  });

  it('Should show error in manufacturer', async () => {
    mockByEdit();

    const wrapper = renderManufactuerCreateOrEdit({
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

  it('Should show manufacturer selected', async () => {
    mockByEdit();

    const wrapper = renderManufactuerCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    await wrapper.findAllByText('editManufacturer');
    userEvent.click(
      wrapper.getByTestId('btn-createOrEditManufacturer')
    );
  });
});
