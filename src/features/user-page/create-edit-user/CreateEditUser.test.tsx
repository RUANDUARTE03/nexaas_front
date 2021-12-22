import React from 'react';
import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { mockStore } from '../../../utils/tests';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import {
  CREATE_USER,
  GET_USER,
  UPDATE_ORGANIZATION,
} from '../../../graphql/queries/users';
import CreateEditUser from '.';

jest.mock(
  '../../../components/Chameleon/input-chameleon/InputChameleon',
  () => (props: any) => <input type="text" {...props} />
);

function mockByEdit() {
  jest
    .spyOn(require('next/router'), 'useRouter')
    .mockImplementation(() => ({
      route: '/users',
      pathname: '',
      query: { id: 1 },
      asPath: '',
      push: jest.fn(),
    }));
}

const mocks = [
  {
    request: {
      query: GET_USER,
      variables: { id: 1 },
    },
    result: {
      data: {
        user: {
          id: 1,
          email: 'teste@nexaas.com',
          role: 'admin',
          organizationIds: [1, 2, 3],
        },
      },
    },
  },
];

const mockError = [
  {
    request: {
      query: GET_USER,
      variables: { id: 1 },
    },
    error: new Error('An error occurred'),
  },
];

const mockCreate = [
  {
    request: {
      query: CREATE_USER,
    },
    result: {
      data: {
        user: {
          document,
        },
      },
    },
  },
];

type userProps = {
  mockStoreProvider: ReturnType<typeof mockStore>;
  mocksByAction: any;
};

function renderUserCreateOrEdit({
  mockStoreProvider,
  mocksByAction,
}: userProps) {
  return render(
    <Provider store={mockStoreProvider}>
      <MockedProvider
        mocks={mocksByAction}
        addTypename={false}
      >
        <CreateEditUser />
      </MockedProvider>
    </Provider>
  );
}

describe('Test feature User', () => {
  it.each([
    [1, 'Editar', false],
    [null, 'Criar', true],
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

      const wrapper = renderUserCreateOrEdit({
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
            ? 'editUserBtn Usuário'
            : 'createUserBtn Usuário'
        }`
      )[0];
    }
  );

  it('Should show loading', () => {
    mockByEdit();
    const wrapper = renderUserCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    expect(
      wrapper.getByTestId('container-loading-data')
    ).toBeInTheDocument();
  });

  it('Should call redirect for user when click in cancel', async () => {
    jest
      .spyOn(require('next/router'), 'useRouter')
      .mockImplementation(() => ({
        route: '/users',
        pathname: '',
        query: { id: 1 },
        asPath: '',
        push: jest.fn(),
      }));

    const wrapper = renderUserCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    userEvent.click(
      wrapper.getByTestId('btn-createOrEditUser-cancel')
    );
  });

  it('Should read in all inputs and formatters', async () => {
    mockByEdit();

    const wrapper = renderUserCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    expect(
      wrapper.getByDisplayValue('Administrador')
    ).toBeDefined();

    expect(wrapper.getByText('teste@nexaas.com'));
  });

  it('Should write in all inputs the informations', async () => {
    jest
      .spyOn(require('next/router'), 'useRouter')
      .mockImplementation(() => ({
        route: '/users',
        pathname: '',
        query: { id: null },
        asPath: '',
        push: jest.fn(),
      }));

    const wrapper = renderUserCreateOrEdit({
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
      'teste@nexaas.com'
    );

    userEvent.type(
      wrapper.getAllByRole('textbox')[1],
      'Administrador'
    );
  });

  it('Should show error in provider', async () => {
    mockByEdit();

    const wrapper = renderUserCreateOrEdit({
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

  it('Should click in header menu', async () => {
    mockByEdit();

    const wrapper = renderUserCreateOrEdit({
      mockStoreProvider: mockStore(),
      mocksByAction: mocks,
    });

    await act(async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    });

    const breadcumb = wrapper.getAllByText('breadcumb')[0];

    breadcumb.click();
  });
});
