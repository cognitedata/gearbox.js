import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { AssetSearchFormValue } from 'mocks/assetsList';

import AssetSearchForm from 'components/AssetSearchForm/AssetSearchForm';
import { VAdvancedSearch } from 'utils/validators';

const onChange = (searchFields: VAdvancedSearch) =>
  action('onChange')(searchFields);
const onPressEnter = () => action('onPressEnter')();
const onSubmit = (searchFields: VAdvancedSearch) =>
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
