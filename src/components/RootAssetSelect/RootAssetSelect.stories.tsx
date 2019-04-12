import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import RootAssetSelect from 'components/RootAssetSelect/RootAssetSelect';

import { assetsList } from 'mocks/assetsList';

const onAssetSelected = (assetId: number) => action('onAssetSelected')(assetId);

storiesOf('RootAssetSelect', module)
  .add('Basic', () => (
    <RootAssetSelect
      assetId={0}
      assets={assetsList}
      onAssetSelected={onAssetSelected}
    />
  ))
  .add('Loading forever', () => (
    <RootAssetSelect
      assetId={0}
      assets={[]}
      onAssetSelected={onAssetSelected}
    />
  ));
