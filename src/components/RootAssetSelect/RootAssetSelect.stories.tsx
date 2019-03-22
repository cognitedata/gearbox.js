import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import RootAssetSelect from 'components/RootAssetSelect/RootAssetSelect';

import { assetsList } from 'mocks/assetsList';
import { VId } from 'utils/validators';

const onAssetSelected = (assetId: VId) => action('onAssetSelected')(assetId);

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
