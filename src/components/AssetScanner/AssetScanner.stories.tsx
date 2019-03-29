import React from 'react';
import { storiesOf } from '@storybook/react';
import AssetScanner from 'components/AssetScanner/AssetScanner';
import { action } from '@storybook/addon-actions';


storiesOf('AssetScanner', module).add('Base', () => (
  <AssetScanner />
));
