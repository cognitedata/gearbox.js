import React from 'react';
import { Table } from 'antd';
import { AssetDetailsPanelProps } from 'utils/validators/AssetTypes';

const AssetDetailsPanel = (props: AssetDetailsPanelProps) => {
  const defaultStyle = {
    borderRadius: '5px',
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.45)',
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const {
    dataSource,
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
AssetDetailsPanel.displayName = 'AssetDetailsPanel';

export default AssetDetailsPanel;
