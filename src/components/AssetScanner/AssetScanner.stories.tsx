import React from 'react';
import { ReactAuthProvider } from '@cognite/react-auth';
import { storiesOf } from '@storybook/react';
import AssetScanner from 'components/AssetScanner/AssetScanner';
import { action } from '@storybook/addon-actions';
import { VOnAssetListCallback, VCallbackStrings } from '../../utils/validators';

const PROJECT_NAME = 'publicdata';
const onAssetFind: VOnAssetListCallback = assets =>
  action('pnAssetFind')(assets);
const onStringRecognize: VCallbackStrings = strings =>
  action('onStringRecognize')(strings);

storiesOf('AssetScanner', module).add(
  'Base',
  () => (
    <ReactAuthProvider
      project={PROJECT_NAME}
      redirectUrl={window.location.href}
      errorRedirectUrl={window.location.href}
    >
      <AssetScanner
        onAssetFind={onAssetFind}
        onStringRecognize={onStringRecognize}
      />
    </ReactAuthProvider>
  ),
  { info: { propTablesExclude: [ReactAuthProvider] } }
);
