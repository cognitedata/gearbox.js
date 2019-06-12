import * as sdk from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { assetsList } from '../../../mocks';
import { AssetSearch, AssetSearchStyles } from '../AssetSearch';

import advancedSearch from './advancedSearch.md';
import basic from './basic.md';
import customStyles from './customStyles.md';
import empty from './empty.md';
import error from './error.md';
import full from './full.md';
import handleSearchResults from './handleSearchResults.md';
import rootAssetSelect from './rootAssetSelect.md';

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
  )
  .add(
    'Custom styles',
    () => {
      const styles: AssetSearchStyles = {
        advancedSearchButton: { backgroundColor: 'red' },
        rootAssetSelect: { width: '40%' },
        searchResultList: {
          container: {
            backgroundColor: 'purple',
            marginTop: '20px',
          },
          listItem: { marginTop: '10px' },
        },
        advancedSearch: {
          modalBody: { backgroundColor: 'green' },
          searchButton: { backgroundColor: 'teal' },
          clearButton: { backgroundColor: 'magenta' },
          searchForm: {
            container: { backgroundColor: 'gray' },
            addMoreMetadataButton: { backgroundColor: 'lightblue' },
          },
        },
      };
      return (
        <AssetSearch
          onLiveSearchSelect={onLiveSearchSelect}
          styles={styles}
          advancedSearch={true}
          rootAssetSelect={true}
        />
      );
    },
    {
      readme: {
        content: customStyles,
      },
    }
  )
  .add(
    'Handle search results',
    () => {
      class WrapperComponent extends React.Component {
        state = {
          items: [],
        };
        onSearchResult = (assets: sdk.Asset[]) => {
          this.setState({
            items: assets,
          });
        };
        render() {
          const { items } = this.state;
          return (
            <React.Fragment>
              <AssetSearch
                showLiveSearchResults={false}
                onSearchResult={this.onSearchResult}
              />
              <br />
              <p>
                Search results: [
                {items.map((item: sdk.Asset) => item.name).join(', ')}]
              </p>
            </React.Fragment>
          );
        }
      }
      return <WrapperComponent />;
    },
    {
      readme: {
        content: handleSearchResults,
      },
    }
  );
