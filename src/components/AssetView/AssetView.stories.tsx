// @ts-ignore
import { action } from '@storybook/addon-actions';
import React from 'react';
import { storiesOf } from '@storybook/react';
import { AssetView } from './AssetView';

const INVALID_ASSET = { id: -1 };
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
  .add('Missing', () => <AssetView asset={INVALID_ASSET} />)
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
