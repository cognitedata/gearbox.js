import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { AssetSearchFormValue } from '../../mocks';

import { AssetSearchForm } from './AssetSearchForm';
import { AdvancedAssetSearch } from '../../interfaces';

const onChange = (searchFields: AdvancedAssetSearch) =>
  action('onChange')(searchFields);
const onPressEnter = () => action('onPressEnter')();
const onSubmit = (searchFields: AdvancedAssetSearch) =>
  action('onSubmit')(searchFields);

storiesOf('AssetSearchForm', module)
  .add('Basic', () => (
    <AssetSearchForm
      onChange={onChange}
      onPressEnter={onPressEnter}
      onSubmit={onSubmit}
      value={null}
    />
  ))
  .add('Predefined fields', () => (
    <AssetSearchForm
      onChange={onChange}
      onPressEnter={onPressEnter}
      onSubmit={onSubmit}
      value={AssetSearchFormValue}
    />
  ));
