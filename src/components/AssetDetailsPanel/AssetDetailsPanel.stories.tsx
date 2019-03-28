import React from 'react';
import { storiesOf } from '@storybook/react';
import AssetDetailsPanel from 'components/AssetDetailsPanel/AssetDetailsPanel';
import { ASSET_META_DATA_SOURCE } from 'mocks/assets';

storiesOf('AssetDetailsPanel', module)
  .addParameters({
    info: {
      inline: true,
      maxPropObjectKeys: 10,
    },
  })
  .add(
    'Standard',
    () => <AssetDetailsPanel dataSource={ASSET_META_DATA_SOURCE} />,
    {
      info: {
        text:
          'Standard view of assetdetailspanel where left-side is the meta-data and right side is the value',
      },
    }
  )
  .add('Empty', () => <AssetDetailsPanel dataSource={[]} />)
  .add('No borders', () => (
    <AssetDetailsPanel dataSource={ASSET_META_DATA_SOURCE} bordered={false} />
  ))
  .add('Show headers', () => (
    <AssetDetailsPanel dataSource={ASSET_META_DATA_SOURCE} showHeader={true} />
  ))
  .add('Scroll lines', () => (
    <AssetDetailsPanel
      dataSource={ASSET_META_DATA_SOURCE}
      scroll={{ y: '75vh', x: '100' }}
    />
  ))
  .add('Custom design', () => (
    <AssetDetailsPanel
      dataSource={ASSET_META_DATA_SOURCE}
      style={{
        border: '4px solid grey',
        margin: '16px',
      }}
    />
  ));
