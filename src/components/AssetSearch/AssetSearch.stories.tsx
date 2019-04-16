import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { AssetSearch } from './AssetSearch';
import { assetsList } from '../../mocks';
import { ApiQuery, ID } from '../../interfaces';

const onSearchResults = (result: any, apiQuery?: ApiQuery) =>
  action('onSearchResults')(result, apiQuery);
const onSearch = (apiQuery: ApiQuery) => action('onSearch')(apiQuery);
const onAssetSelected = (assetId: ID) => action('onAssetSelected')(assetId);
const onFilterIconClick = () => action('onFilterIconClick')();

storiesOf('AssetSearch', module)
  .add('Basic', () => (
    <AssetSearch onSearchResults={onSearchResults} onSearch={onSearch} />
  ))
  .add('With custom placeholder', () => (
    <AssetSearch
      onSearchResults={onSearchResults}
      onSearch={onSearch}
      strings={{ searchPlaceholder: 'custom text' }}
    />
  ))
  .add('With advanced search', () => (
    <AssetSearch
      onSearchResults={onSearchResults}
      onSearch={onSearch}
      onFilterIconClick={onFilterIconClick}
      advancedSearch={true}
    />
  ))
  .add('With asset root selection', () => (
    <AssetSearch
      onSearchResults={onSearchResults}
      onSearch={onSearch}
      onAssetSelected={onAssetSelected}
      rootAssetSelect={true}
      assets={assetsList}
    />
  ));
