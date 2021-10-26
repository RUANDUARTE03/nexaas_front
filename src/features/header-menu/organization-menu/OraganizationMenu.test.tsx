import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { mockStore } from '../../../utils/tests';
import { MockedProvider } from '@apollo/client/testing';
import { CHANGE_CURRENT_ORGANIZATION } from '../../../graphql/queries/organizations';
import OrganizationMenu from './OrganizationMenu';

const mock = [
  {
    request: {
      query: CHANGE_CURRENT_ORGANIZATION,
      variables: { id: 1 },
    },
    result: {
      data: {
        organization: {
          id: 1,
        },
      },
    },
  },
];

type OrganizationMenuProps = {
  organizations: {
    id: string;
    name: string;
  }[];
  mockStoreProvider: ReturnType<typeof mockStore>;
};

function renderOrganizationMenu({
  mockStoreProvider,
  organizations,
}: OrganizationMenuProps) {
  return render(
    <Provider store={mockStoreProvider}>
      <MockedProvider mocks={mock} addTypename={false}>
        <OrganizationMenu organizations={organizations} />
      </MockedProvider>
    </Provider>
  );
}

describe('Test OrganizationMenu component', () => {
  it('Should render correctly', () => {
    renderOrganizationMenu({
      mockStoreProvider: mockStore(),
      organizations: [
        { id: '1', name: 'nameOne' },
        { id: '2', name: 'nameTwo' },
      ],
    });
  });

  it('Should render name correctly', () => {
    const wrapper = renderOrganizationMenu({
      mockStoreProvider: mockStore(),
      organizations: [
        { id: '1', name: 'nameOne' },
        { id: '2', name: 'nameTwo' },
      ],
    });

    wrapper.getByText('nameOne');
    wrapper.getByText('nameTwo');

    wrapper.getByText('nameOne').click();
  });
});
