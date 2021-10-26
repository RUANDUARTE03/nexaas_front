import React from 'react';
import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { mockStore } from '../../../utils/tests';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import CreateOrEditProvider from '.';
import {
  GET_PROVIDER,
  CREATE_PROVIDER,
} from '../../../graphql/queries/providers';

jest.mock(
  '../../../components/Chameleon/InputChameleon',
  () => (props: any) => <input type="text" {...props} />
);

function mockByEdit() {
  jest
    .spyOn(require('next/router'), 'useRouter')
    .mockImplementation(() => ({
      route: '/providers',
      pathname: '',
      query: { id: 1 },
      asPath: '',
      push: jest.fn(),
    }));
}

const mocks = [
  {
    request: {
      query: GET_PROVIDER,
      variables: { id: 1 },
    },
    result: {
      data: {
        provider: {
          id: 1,
          document: '52723924000110',
          name: 'name',
          tradingName: 'tradingName',
          stateInscriptionType: 'icms',
          providerType: 'Transportadora',
          externalId: 'ExternalId',
          street: 'street',
          number: 'number',
          detail: 'detail',
          zipcode: '03632-060',
          neighborhood: 'neighborhood',
          cityCode: 'cityCode',
          city: 'city',
          state: 'state',
          country: 'country',
          stateInscription: 'stateInscription',
        },
      },
    },
  },
];

const mockCreate = [
  {
    request: {
      query: CREATE_PROVIDER,
    },
    result: {
      data: {
        provider: {
          document,
        },
      },
    },
  },
];

const mockError = [
  {
    request: {
      query: GET_PROVIDER,
      variables: { id: 1 },
    },
    error: new Error('An error occurred'),
  },
];

type providerProps = {
  mockStoreProvider: ReturnType<typeof mockStore>;
  mocksByAction: any;
};

function renderProviderCreateOrEdit({
  mockStoreProvider,
  mocksByAction,
}: providerProps) {
  return render(
    <Provider store={mockStoreProvider}>
      <MockedProvider
        mocks={mocksByAction}
        addTypename={false}
      >
        <CreateOrEditProvider />
      </MockedProvider>
    </Provider>
  );
}

describe('Test feature Provider', () => {
  it.each([
    [1, 'Editar', false],
    [null, 'Novo', true],
  ])(
    'Should render correctly mode %s',
    async (query, mode, create) => {
      jest
        .spyOn(require('next/router'), 'useRouter')
        .mockImplementation(() => ({
          route: '/providers',
          pathname: '',
          query: { id: query },
          asPath: '',
          push: jest.fn(),
        }));

      const wrapper = renderProviderCreateOrEdit({
        mockStoreProvider: mockStore(),
        mocksByAction: create ? mockCreate : mocks,
      });

      await act(async () => {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000)
        );
      });

      wrapper.getAllByText(`${mode} Fornecedor`)[0];
    }
  );

  it('Should show loading', () => {
    mockByEdit();
    const wrapper = renderProviderCreateOrEdit({
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
        route: '/providers',
        pathname: '',
        query: { id: 1 },
        asPath: '',
        push: jest.fn(),
      }));

    const wrapper = renderProviderCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    userEvent.click(
      wrapper.getByTestId('btn-createOrEditProvider-cancel')
    );
  });

  it('Should read in all inputs and formatters', async () => {
    mockByEdit();

    const wrapper = renderProviderCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    [
      '52.723.924/0001-10',
      'name',
      'tradingName',
      'Transportadora',
      '1',
      'stateInscription',
      'ExternalId',
      '03632-060',
      'street',
      'number',
      'detail',
      'neighborhood',
      'city',
      'cityCode',
      'state',
    ].map((el) => {
      expect(wrapper.getByDisplayValue(el)).toBeDefined();
    });
  });

  it('Should write in all identifier and formatter', async () => {
    mockByEdit();

    const wrapper = renderProviderCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    userEvent.type(
      wrapper.getAllByRole('textbox')[0],
      '{backspace}'
    );
    userEvent.type(wrapper.getAllByRole('textbox')[0], '5');

    expect(
      wrapper.getByDisplayValue('52.723.924/0001-15')
    ).toBeDefined();

    for (let i = 1; i <= 3; i++) {
      userEvent.type(
        wrapper.getAllByRole('textbox')[0],
        '{backspace}'
      );
    }

    expect(
      wrapper.getByDisplayValue('527.239.240-00')
    ).toBeDefined();
  });

  it('Should write in all inputs the informations', async () => {
    mockByEdit();

    const wrapper = renderProviderCreateOrEdit({
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
        NumberRole: 1,
        text: 'Company',
        expect: 'nameCompany',
      },
      {
        NumberRole: 2,
        text: 'Fantasy',
        expect: 'tradingNameFantasy',
      },
      {
        NumberRole: 5,
        text: 'Test',
        expect: 'stateInscriptionTest',
      },
      {
        NumberRole: 6,
        text: 'Test',
        expect: 'ExternalIdTest',
      },
      {
        NumberRole: 7,
        text: '{backspace}',
        expect: '03632-065',
        formatter: true,
      },
      {
        NumberRole: 8,
        text: 'Test',
        expect: 'streetTest',
      },
      {
        NumberRole: 9,
        text: '9',
        expect: 'number9',
      },
      {
        NumberRole: 10,
        text: 'Test',
        expect: 'detailTest',
      },
      {
        NumberRole: 11,
        text: 'Test',
        expect: 'neighborhoodTest',
      },
      {
        NumberRole: 12,
        text: 'Test',
        expect: 'cityTest',
      },
      {
        NumberRole: 13,
        text: 'Test',
        expect: 'cityCodeTest',
      },
    ].map((x) => {
      userEvent.type(
        wrapper.getAllByRole('textbox')[x.NumberRole],
        x.text
      );

      if (x.formatter) {
        userEvent.type(
          wrapper.getAllByRole('textbox')[x.NumberRole],
          '5'
        );
      }

      expect(
        wrapper.getByDisplayValue(x.expect)
      ).toBeDefined();
    });
  });

  it('Should created provider when click in btn success', async () => {});

  it('Should show error in provider', async () => {
    mockByEdit();

    const wrapper = renderProviderCreateOrEdit({
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

  it('Should show provider selected', async () => {
    mockByEdit();

    const wrapper = renderProviderCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    await wrapper.findAllByText('Editar Fornecedor');
    userEvent.click(
      wrapper.getByTestId('btn-createOrEditProvider')
    );
  });
});
