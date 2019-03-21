import React from 'react';
import { storiesOf } from '@storybook/react';
import AssetDetailsPanel, {
  AssetDetailsColumns,
} from 'components/AssetDetailsPanel/AssetDetailsPanel';
import { ASSET_DATA } from 'mocks/assets';

const ASSET_META_DATA_SOURCE = Object.keys(ASSET_DATA.metadata).map(dp => ({
  key: dp,
  name: dp,
  value: (ASSET_DATA.metadata as any)[dp],
}));

storiesOf('AssetDetailsPanel', module)
  .addParameters({
    info: {
      inline: true,
      maxPropObjectKeys: 10,
    },
  })
  .add(
    'Standard',
    () => (
      <AssetDetailsPanel
        dataSource={ASSET_META_DATA_SOURCE}
        columns={AssetDetailsColumns}
      />
    ),
    {
      info: {
        text:
          'Standard view of assetdetailspanel where left-side is the meta-data and right side is the value',
      },
    }
  )
  .add('Empty', () => (
    <AssetDetailsPanel dataSource={[]} columns={AssetDetailsColumns} />
  ))
  .add(
    'No borders',
    () => (
    <AssetDetailsPanel
      dataSource={ASSET_META_DATA_SOURCE}
      columns={AssetDetailsColumns}
      bordered={false}
    />
  ))
  .add('Show headers', () => (
    <AssetDetailsPanel
      dataSource={ASSET_META_DATA_SOURCE}
      columns={AssetDetailsColumns}
      showHeader={true}
    />
  ))
  .add('Scroll lines', () => (
    <AssetDetailsPanel
      dataSource={ASSET_META_DATA_SOURCE}
      columns={AssetDetailsColumns}
      scroll={{ y: '75vh', x: '100' }}
    />
  ))
  .add('Custom design', () => (
    <AssetDetailsPanel
      dataSource={ASSET_META_DATA_SOURCE}
      columns={AssetDetailsColumns}
      style={{
        border: '4px solid grey',
        margin: '16px',
      }}
    />
  ))
  .add('Repeating same column', () => (
    <AssetDetailsPanel
      dataSource={ASSET_META_DATA_SOURCE}
      columns={[
        ...AssetDetailsColumns,
        ...[{ title: 'name', dataIndex: 'name', key: 'name' }],
      ]}
    />
  ))
  .add('Column with no matching data', () => (
    <AssetDetailsPanel
      dataSource={ASSET_META_DATA_SOURCE}
      columns={[
        ...AssetDetailsColumns,
        ...[{ title: 'nomatch', dataIndex: 'nomatch', key: 'nomatch' }],
      ]}
    />
  ))
  .add('Only one column defined', () => (
    <AssetDetailsPanel
      dataSource={ASSET_META_DATA_SOURCE}
      columns={[{ title: 'name', dataIndex: 'name', key: 'name' }]}
    />
  ));
