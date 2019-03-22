import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import AssetSearch from 'components/AssetSearch/AssetSearch';
import { assetsList } from 'mocks/assetsList';
import { VApiQuery, VId } from 'utils/validators';

const onSearchResults = (result: any, apiQuery?: VApiQuery) =>
  action('onSearchResults')(result, apiQuery);
const onSearch = (apiQuery: VApiQuery) => action('onSearch')(apiQuery);
const onAssetSelected = (assetId: VId) => action('onAssetSelected')(assetId);
const onFilterIconClick = () => action('onFilterIconClick')();

storiesOf('AssetSearch', module).add(
  'Search',
  () => (
    <AssetSearch
      onSearchResults={onSearchResults}
      onSearch={onSearch}
      onAssetSelected={onAssetSelected}
      onFilterIconClick={onFilterIconClick}
      assets={assetsList}
    />
  ),
  {
    info: {
      maxPropObjectKeys: 5,
    },
  }
);
