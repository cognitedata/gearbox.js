import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { debounce } from 'lodash';
import { AssetSearch } from '../AssetSearch';
import { assetsList } from '../../../mocks';
import { ApiQuery, ID } from '../../../interfaces';

import * as full from './full.md';
import * as placeholder from './placeholder.md';
import * as advanceSearch from './advance-search.md';
import * as assetSelcetion from './asset-selection.md';
import * as liveSearch from './live-search.md';

const onSearch = (apiQuery: ApiQuery) => action('onSearch')(apiQuery);
const onAssetSelected = (assetId: ID) => action('onAssetSelected')(assetId);
const onFilterIconClick = () => action('onFilterIconClick')();
const onLiveSearchSelect = (item: any) => action('onLiveSearchSelect')(item);

storiesOf('AssetSearch', module).add(
  'Full description',
  () => <AssetSearch onSearch={onSearch} />,
  {
    readme: {
      content: full,
    },
    info: {
      header: false,
      source: false,
      styles: {
        infoBody: { display: 'none' },
      },
    },
  }
);

storiesOf('AssetSearch/Examples', module)
  .addParameters({
    info: {
      header: false,
      source: false,
      styles: {
        infoBody: { display: 'none' },
      },
    },
  })
  .add(
    'With custom placeholder',
    () => (
      <AssetSearch
        onSearch={onSearch}
        strings={{ searchPlaceholder: 'Custom text' }}
      />
    ),
    {
      readme: {
        content: placeholder,
      },
    }
  )
  .add(
    'With advanced search',
    () => (
      <AssetSearch
        onSearch={onSearch}
        onFilterIconClick={onFilterIconClick}
        advancedSearch={true}
      />
    ),
    {
      readme: {
        content: advanceSearch,
      },
    }
  )
  .add(
    'With asset root selection',
    () => (
      <AssetSearch
        onSearch={onSearch}
        onAssetSelected={onAssetSelected}
        rootAssetSelect={true}
        assets={assetsList}
      />
    ),
    {
      readme: {
        content: assetSelcetion,
      },
    }
  )
  .add(
    'Live search enabled',
    () => {
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
            debounceTime={500}
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

      return <Wrapper />;
    },
    {
      readme: {
        content: liveSearch,
      },
    }
  );
