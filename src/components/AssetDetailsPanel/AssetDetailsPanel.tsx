import React from 'react';
import { Table } from 'antd';

export const AssetDetailsColumns = [
  { title: 'name', dataIndex: 'name', key: 'name' },
  { title: 'value', dataIndex: 'value', key: 'value' },
];

interface AssetDetailsPanelProps {
  dataSource: {
    key: string;
    name: string;
    value: string;
  }[];
  columns: {
    title?: string;
    dataIndex: string;
    key: string;
  }[];
  style?: object;
  showHeader?: boolean;
  scroll?: object;
  bordered?: boolean;
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
      showHeader={showHeader}
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      scroll={scroll}
      bordered={bordered}
      style={style}
    />
  );
};
AssetDetailsPanel.displayName = 'AssetDetailsPanel';

export default AssetDetailsPanel;
