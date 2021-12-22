/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/button-has-type */

import React from 'react';
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md';
import Style from './ListingTable.module.scss';

export default function Pagination({
  canPreviousPage,
  canNextPage,
  nextPage,
  previousPage,
  pageIndex,
  pageOptions,
  pageSize,
  setPageSize,
  pageCount,
}) {
  return (
    <div className={Style.paginator}>
      <select
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSizes) => (
          <option key={pageSizes} value={pageSizes}>
            Linhas por página: {pageSizes}
          </option>
        ))}
      </select>
      <div>
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <MdKeyboardArrowLeft
            size={26}
            className={Style.icon}
          />
        </button>{' '}
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <MdKeyboardArrowRight
            size={26}
            className={Style.icon}
          />
        </button>{' '}
        <span>
          Página{' '}
          <strong>
            {pageIndex + 1} de {pageOptions.length}
          </strong>{' '}
        </span>
      </div>
    </div>
  );
}
