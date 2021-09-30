import React from 'react';
import Table from 'rc-table';
import Styles from './ListingTable.module.scss';

export default function ListingTable({ data, columns }) {
  return (
    <Table
      className={`${Styles.listingTableContainer} ch-table`}
      columns={columns}
      data={data}
    />
  );
}
