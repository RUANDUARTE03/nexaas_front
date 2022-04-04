/* eslint-disable react/button-has-type */
import React from 'react';
import { useTable, usePagination } from 'react-table';
import Style from './ListingTable.module.scss';
import Pagination from './Pagination';

interface ListingTableProps {
  data: any;
  columns: any;
  hidePagination?: any;
  borderedTable?: any;
}

export default function ListingTable({
  data,
  columns,
  hidePagination,
  borderedTable,
}: ListingTableProps) {
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
        className={`${Style.listingTable} ch-table ${
          borderedTable ? Style.bordered : ''
        }`}
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps({
                    style: column.style,
                  })}
                >
                  <b>{column.render('Header')}</b>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                data-cy={
                  row.original.name
                    ? row.original.name.replace(' ', '-')
                    : ''
                }
              >
                {row.cells.map((cell, index) => {
                  return (
                    <td
                      {...cell.getCellProps({
                        style: cell.column.style,
                      })}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {!hidePagination && (
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
      )}
    </>
  );
}
