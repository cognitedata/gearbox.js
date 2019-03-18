// @ts-ignore
import { action } from '@storybook/addon-actions';
import AssetView from './AssetView';
import React from 'react';
import { storiesOf } from '@storybook/react';

const IAA = {
  id: 7793176078609329,
  path: [7793176078609329],
  name: 'IAA',
  description: 'IAA Root node',
  metadata: {
    ASSETSCOPENAME: 'IAA',
    DESCRIPTION: 'IAA Root node',
    NAME: 'IAA',
    PARENTUID: '',
    SOURCE: 'Valid',
    SOURCEID: 'Valid.dbo.AkerBP_UNION_ALL_TAG',
    SOURCE_DB: 'valid',
    SOURCE_TABLE: 'iaaassethierarchy',
    TYPE: 'AssetHierarchy',
    UID: 'IAA',
  },
};

const testAsset = {
  id: 123,
  name: 'AAI',
};

storiesOf('AssetView', module)
  .addParameters({
    info: {
      inline: true,
    },
  })
  .add('Basic', () => <AssetView asset={testAsset} />)
  .add('Colors', () => (
    <div>
      <AssetView asset={testAsset} color={false} />
      <AssetView asset={testAsset} color="orange" />
      <AssetView asset={testAsset} color={true} />
    </div>
  ))
  .add('Events', () => (
    <AssetView
      asset={testAsset}
      onClick={action('onClick')}
      onClose={action('onClose')}
    />
  ));
