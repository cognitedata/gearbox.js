import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { AssetScannerStory } from './AssetScannerStory';
import { ErrorResponse } from '../../interfaces';

const onUnauthorized: any = (error: ErrorResponse) => {
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
