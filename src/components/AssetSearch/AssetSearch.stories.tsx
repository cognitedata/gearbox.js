import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { debounce } from 'lodash';
import { AssetSearch } from './AssetSearch';
import { assetsList } from '../../mocks';
import { ApiQuery, ID } from '../../interfaces';

const onSearchResults = (result: any, apiQuery?: ApiQuery) =>
  action('onSearchResults')(result, apiQuery);
const onSearch = (apiQuery: ApiQuery) => action('onSearch')(apiQuery);
const onAssetSelected = (assetId: ID) => action('onAssetSelected')(assetId);
const onFilterIconClick = () => action('onFilterIconClick')();
const onLiveSearchSelect = (item: any) => action('onLiveSearchSelect')(item);

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
  ))
  .add('Live search enabled', () => {
    const Wrapper = () => {
      const initial: any[] = [];
      const [liveSearchResults, setResults] = useState(initial);
      const [loading, setLoading] = useState(false);

      const onSearchLive = debounce(apiQuery => {
        action('onSearch')(apiQuery);
        setLoading(false);
        setResults(assetsList.slice());
      }, 1000);

      return (
        <AssetSearch
          onSearchResults={onSearchResults}
          onSearch={query => {
            setLoading(true);
            onSearchLive(query);
          }}
          liveSearch={true}
          liveSearchResults={liveSearchResults}
          onLiveSearchSelect={onLiveSearchSelect}
          loading={loading}
          strings={{ searchPlaceholder: 'Live search' }}
        />
      );
    };

    Wrapper.displayName = 'AssetSearch';

    return <Wrapper />;
  });
