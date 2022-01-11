/* eslint-disable react/button-has-type */
import React from 'react';
import { useTable, usePagination } from 'react-table';
import Style from './ListingTable.module.scss';
import Pagination from './Pagination';

export default function ListingTable({ data, columns }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable({ data, columns }, usePagination);

  return (
    <>
      <table
        className={`${Style.listingTable} ch-table`}
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        nextPage={nextPage}
        previousPage={previousPage}
        pageIndex={pageIndex}
        pageOptions={pageOptions}
        pageSize={pageSize}
        setPageSize={setPageSize}
        pageCount={pageCount}
      />
    </>
  );
}
