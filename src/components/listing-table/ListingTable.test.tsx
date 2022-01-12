import React from 'react';
import { render } from '@testing-library/react';
import ListingTable from './ListingTable';

function renderListingTable({
  data,
  columns,
  hidePagination,
}) {
  return render(
    <ListingTable
      data={data}
      columns={columns}
      hidePagination={hidePagination}
    />
  );
}

it('Should render corretly', () => {
  renderListingTable({
    data: [],
    columns: [
      {
        Header: 'test',
        accessor: 'name',
      },
      {
        Header: 'test',
        accessor: 'cnpj',
      },
      {
        Header: 'test',
        accessor: 'actions',
      },
    ],
    hidePagination: false,
  });
});
