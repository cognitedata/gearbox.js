import React from 'react';
import { Table } from 'antd';
import {
  TableDataSourceType,
  TableColumnType,
  TableDesignType,
} from 'utils/validators/AssetTypes';

export const AssetDetailsColumns = [
  { title: 'name', dataIndex: 'name', key: 'name' },
  { title: 'value', dataIndex: 'value', key: 'value' },
];

interface AssetDetailsPanelProps extends TableDesignType {
  dataSource: TableDataSourceType[];
  columns: TableColumnType[];
}

const AssetDetailsPanel = (props: AssetDetailsPanelProps) => {
  const defaultStyle = {
    borderRadius: '5px',
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.45)',
  };

  const defaultColumns = [
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const {
    dataSource,
    columns = defaultColumns,
    style = defaultStyle,
    showHeader = false,
    bordered = true,
    scroll = {},
  } = props;

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      showHeader={showHeader}
      pagination={false}
      scroll={scroll}
      bordered={bordered}
      style={style}
    />
  );
};

export default AssetDetailsPanel;
