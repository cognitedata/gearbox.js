import React from 'react';
import { storiesOf } from '@storybook/react';
import { AssetScannerStory } from 'components/AssetScanner/AssetScannerStory';
import { action } from '@storybook/addon-actions';
import { VErrorResponse } from 'utils/validators';

const onUnauthorized: any = (error: VErrorResponse) => {
  action('onUnauthorized')(error);
};

storiesOf('AssetScanner', module).add(
  'Base',
  () => (
    <AssetScannerStory
      onUnauthorized={onUnauthorized}
      ocrKey={'YOUR_GOOGLE_VISION_KEY'}
    />
  ),
  { info: { propTablesExclude: [AssetScannerStory] } }
);
