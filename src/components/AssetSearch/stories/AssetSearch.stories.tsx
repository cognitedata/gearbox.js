import React from 'react';
import * as sdk from '@cognite/sdk';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { AssetSearch } from '../AssetSearch';
import { assetsList } from '../../../mocks';

import * as full from './full.md';
import * as basic from './basic.md';
import * as empty from './empty.md';
import * as error from './error.md';

// Mock the SDK calls
sdk.Assets.search = async (
  query: sdk.AssetSearchParams
): Promise<sdk.AssetDataWithCursor> => {
  if (query.query === 'empty') {
    return { items: [] };
  }

  if (query.query === 'error') {
    throw { message: 'sdk search request failed' };
  }

  return {
    items: assetsList.map(
      (a: sdk.Asset): sdk.Asset => {
        return {
          id: Number.parseInt(a.id.toString(), 10),
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
  );
