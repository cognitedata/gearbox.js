import * as sdk from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { assetsList } from '../../../mocks';
import { AssetSearch } from '../AssetSearch';

import * as advancedSearch from './advancedSearch.md';
import * as basic from './basic.md';
import * as empty from './empty.md';
import * as error from './error.md';
import * as full from './full.md';
import * as rootAssetSelect from './rootAssetSelect.md';

// Mock the SDK calls
sdk.Assets.list = async (
  input: sdk.AssetListParams
): Promise<sdk.AssetDataWithCursor> => {
  action('sdk.Assets.list')(input);
  return {
    items: assetsList.map(
      (a: sdk.Asset): sdk.Asset => {
        return {
          id: a.id,
          name: a.name,
          description: a.description,
        };
      }
    ),
  };
};

sdk.Assets.search = async (
  query: sdk.AssetSearchParams
): Promise<sdk.AssetDataWithCursor> => {
  action('sdk.Assets.search')(query);
  if (query.query === 'empty') {
    return { items: [] };
  }

  if (query.query === 'error') {
    throw { message: 'sdk search request failed' };
  }

  return {
    items: assetsList.map(
      // tslint:disable-next-line: no-identical-functions
      (a: sdk.Asset): sdk.Asset => {
        return {
          id: a.id,
          name: a.name,
          description: a.description,
        };
      }
    ),
  };
};

const onLiveSearchSelect = (asset: sdk.Asset) =>
  action('onLiveSearchSelect')(asset);
const onError = (e: any) => action('onError')(e);
const basicStrings = {
  searchPlaceholder: 'Try to type name of asset',
};
const emptyStrings = {
  emptyLiveSearch: 'No results',
  searchPlaceholder: 'Type "empty" to test behaviour',
};
const errorStrings = {
  emptyLiveSearch: 'No results',
  searchPlaceholder: 'Type "error" to test behaviour',
};

storiesOf('AssetSearch', module).add(
  'Full description',
  () => <AssetSearch onLiveSearchSelect={onLiveSearchSelect} />,
  {
    readme: {
      content: full,
    },
  }
);

storiesOf('AssetSearch/Examples', module)
  .add(
    'Basic',
    () => (
      <AssetSearch
        onLiveSearchSelect={onLiveSearchSelect}
        strings={basicStrings}
      />
    ),
    {
      readme: {
        content: basic,
      },
    }
  )
  .add(
    'Empty results',
    () => (
      <AssetSearch
        onLiveSearchSelect={onLiveSearchSelect}
        strings={emptyStrings}
      />
    ),
    {
      readme: {
        content: empty,
      },
    }
  )
  .add(
    'Error handling',
    () => (
      <AssetSearch
        onError={onError}
        onLiveSearchSelect={onLiveSearchSelect}
        strings={errorStrings}
      />
    ),
    {
      readme: {
        content: error,
      },
    }
  )
  .add(
    'Root asset select',
    () => (
      <AssetSearch
        onLiveSearchSelect={onLiveSearchSelect}
        rootAssetSelect={true}
      />
    ),
    {
      readme: {
        content: rootAssetSelect,
      },
    }
  )
  .add(
    'Advanced search',
    () => (
      <AssetSearch
        onLiveSearchSelect={onLiveSearchSelect}
        advancedSearch={true}
      />
    ),
    {
      readme: {
        content: advancedSearch,
      },
    }
  );
