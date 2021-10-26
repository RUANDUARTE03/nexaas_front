import React from 'react';
import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { mockStore } from '../../../utils/tests';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { CREATE_ORGANIZATION, GET_ORGANIZATION } from '../../../graphql/queries/organizations';
import CreateEditOrganization from '.';

jest.mock(
  '../../../components/Chameleon/InputChameleon',
  () => (props: any) => <input type="text" {...props} />
);

const mocks = [
  {
    request: {
      query: GET_ORGANIZATION,
      variables: { id: 1 },
    },
    result: {
      data: {
        organization: {
            id: "1",
            name: "Loja 123",
            cnpj: "55492986000156",
            stateRegistration: "23231323231",
            companyName: "Loja Teste Ltda.",
            averageWithdrawalTerm: 3,
            averageWithdrawalPrice: 14,
            deliveryRadiusMax: "unlimited",
            kind: "other",
            cityCode: "3549904",
            city: "São José dos Campos",
            street: "Rua Manoel Fiel Filho",
            state: "SP",
            number: "2",
            neighborhood: "Bosque dos Eucaliptos",
            zipCode: "12233690",
            complement: null,
            latitude: "-23.2529701",
            longitude: "-45.8872027",
            emitesId: 558,
            serieNfe: "1",
            taxRegime: "normal",
            useAverageCost: true
        },
      },
    },
  },
];

const mockCreate = [
  {
    request: {
      query: CREATE_ORGANIZATION,
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
      query: GET_ORGANIZATION,
      variables: { id: 1 },
    },
    error: new Error('An error occurred'),
  },
];

type providerProps = {
  mockStoreProvider: ReturnType<typeof mockStore>;
  mocksByAction: any;
};

function renderOrganizationCreateOrEdit({
  mockStoreProvider,
  mocksByAction,
}: providerProps) {
  return render(
    <Provider store={mockStoreProvider}>
      <MockedProvider
        mocks={mocksByAction}
        addTypename={false}
      >
        <CreateEditOrganization />
      </MockedProvider>
    </Provider>
  );
}

describe('Test feature Organization', () => {
  it.each([
    [1, 'Editar', false],
    [null, 'Nova', true],
  ])(
    'Should render correctly mode %s',
    async (query, mode, create) => {
      jest
        .spyOn(require('next/router'), 'useRouter')
        .mockImplementation(() => ({
          route: '/organizations',
          pathname: '',
          query: { id: query },
          asPath: '',
          push: jest.fn(),
        }));

      const wrapper = renderOrganizationCreateOrEdit({
        mockStoreProvider: mockStore(),
        mocksByAction: create ? mockCreate : mocks,
      });

      await act(async () => {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000)
        );
      });

      wrapper.getAllByText(`${mode} Organização`)[0];
    }
  );

  it('Should show loading', () => {
    jest
      .spyOn(require('next/router'), 'useRouter')
      .mockImplementation(() => ({
        route: '/organizations',
        pathname: '',
        query: { id: 1 },
        asPath: '',
        push: jest.fn(),
      }));

    const wrapper = renderOrganizationCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    expect(
      wrapper.getByTestId('container-loading-data')
    ).toBeInTheDocument();
  });

  it('Should call redirect for organization when click in cancel', async () => {
    jest
      .spyOn(require('next/router'), 'useRouter')
      .mockImplementation(() => ({
        route: '/organizations',
        pathname: '',
        query: { id: 1 },
        asPath: '',
        push: jest.fn(),
      }));

    const wrapper = renderOrganizationCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    userEvent.click(
      wrapper.getByTestId('btn-createOrEditOrganization-cancel')
    );
  });

  it('Should read in all inputs and formatters', async () => {
    jest
      .spyOn(require('next/router'), 'useRouter')
      .mockImplementation(() => ({
        route: '/organizations',
        pathname: '',
        query: { id: 1 },
        asPath: '',
        push: jest.fn(),
      }));

    const wrapper = renderOrganizationCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    [
      "Loja 123",
      "55.492.986/0001-56",
      "23231323231",
      "Loja Teste Ltda.",
      '3',
      '14',
      "unlimited",
      "other",
      "3549904",
      "São José dos Campos",
      "Rua Manoel Fiel Filho",
      "SP",
      "2",
      "Bosque dos Eucaliptos",
      "12233690",
      "-23.2529701",
      "-45.8872027",
      '558',
      "1",
      "normal",
    ].map((el) => {
      expect(wrapper.getByDisplayValue(el)).toBeDefined();
    });
  });

  it('Should write in all identifier and formatter', async () => {
    jest
      .spyOn(require('next/router'), 'useRouter')
      .mockImplementation(() => ({
        route: '/organizations',
        pathname: '',
        query: { id: 1 },
        asPath: '',
        push: jest.fn(),
      }));

    const wrapper = renderOrganizationCreateOrEdit({
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
      wrapper.getByDisplayValue('55.492.986/0001-56')
    ).toBeDefined();
  });

  it('Should show error in organization', async () => {
    jest
      .spyOn(require('next/router'), 'useRouter')
      .mockImplementation(() => ({
        route: '/organizations',
        pathname: '',
        query: { id: 1 },
        asPath: '',
        push: jest.fn(),
      }));

    const wrapper = renderOrganizationCreateOrEdit({
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

  it('Should show organization selected', async () => {
    jest
      .spyOn(require('next/router'), 'useRouter')
      .mockImplementation(() => ({
        route: '/organizations',
        pathname: '',
        query: { id: 1 },
        asPath: '',
        push: jest.fn(),
      }));

    const wrapper = renderOrganizationCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    await wrapper.findAllByText('Editar Organização');
    userEvent.click(
      wrapper.getByTestId('btn-createOrEditOrganization')
    );
  });
});
