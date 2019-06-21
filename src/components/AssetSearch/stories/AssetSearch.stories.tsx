import { API } from '@cognite/sdk-alpha/dist/src/resources/api';
import {
  Asset,
  AssetListScope,
  AssetSearchFilter,
} from '@cognite/sdk-alpha/dist/src/types/types';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { assetsList } from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { AssetSearch, AssetSearchStyles } from '../AssetSearch';

import advancedSearch from './advancedSearch.md';
import basic from './basic.md';
import customStyles from './customStyles.md';
import empty from './empty.md';
import error from './error.md';
import full from './full.md';
import handleSearchResults from './handleSearchResults.md';
// import rootAssetSelect from './rootAssetSelect.md';

// Mock the SDK calls
export const fakeClient: API = {
  // @ts-ignore
  assets: {
    // @ts-ignore
    list: (scope: AssetListScope) => {
      action('assets.list')(scope);
      const items = assetsList.map(
        (a: Asset): Asset => {
          return {
            id: a.id,
            name: a.name,
            description: a.description,
            lastUpdatedTime: a.lastUpdatedTime,
            createdTime: a.createdTime,
            depth: a.depth,
            path: a.path,
          };
        }
      );
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(items);
        });
      });
    },
    search: (query: AssetSearchFilter) => {
      action('Assets.search')(query);
      if (query.search && query.search.name === 'empty') {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve([]);
          });
        });
      }

      if (query.search && query.search.name === 'error') {
        throw { message: 'sdk search request failed' };
      }

      const items = assetsList.map(
        (a: Asset): Asset => {
          return {
            id: a.id,
            name: a.name,
            description: a.description,
            lastUpdatedTime: a.lastUpdatedTime,
            createdTime: a.createdTime,
            depth: a.depth,
            path: a.path,
          };
        }
      );
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(items);
        });
      });
    },
  },
};

const onLiveSearchSelect = (asset: Asset) =>
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
  () => (
    <ClientSDKProvider client={fakeClient}>
      <AssetSearch onLiveSearchSelect={onLiveSearchSelect} />
    </ClientSDKProvider>
  ),
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
      <ClientSDKProvider client={fakeClient}>
        <AssetSearch
          onLiveSearchSelect={onLiveSearchSelect}
          strings={basicStrings}
        />
      </ClientSDKProvider>
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
      <ClientSDKProvider client={fakeClient}>
        <AssetSearch
          onLiveSearchSelect={onLiveSearchSelect}
          strings={emptyStrings}
        />
      </ClientSDKProvider>
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
      <ClientSDKProvider client={fakeClient}>
        <AssetSearch
          onError={onError}
          onLiveSearchSelect={onLiveSearchSelect}
          strings={errorStrings}
        />
      </ClientSDKProvider>
    ),
    {
      readme: {
        content: error,
      },
    }
  )
  /* TODO disabled due to rootAssetSelect changes in SDK 2.0
  .add(
    'Root asset select',
    () => (
      <ClientSDKProvider client={fakeClient}>
        <AssetSearch
          onLiveSearchSelect={onLiveSearchSelect}
        rootAssetSelect={true} />
      </ClientSDKProvider>
    ),
    {
      readme: {
        content: rootAssetSelect,
      },
    }
  ) */
  .add(
    'Advanced search',
    () => (
      <ClientSDKProvider client={fakeClient}>
        <AssetSearch
          onLiveSearchSelect={onLiveSearchSelect}
          advancedSearch={true}
        />
      </ClientSDKProvider>
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
        // rootAssetSelect: { width: '40%' },
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
        <ClientSDKProvider client={fakeClient}>
          <AssetSearch
            onLiveSearchSelect={onLiveSearchSelect}
            styles={styles}
            advancedSearch={true}
            // rootAssetSelect={true}
          />
        </ClientSDKProvider>
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
        onSearchResult = (assets: Asset[]) => {
          this.setState({
            items: assets,
          });
        };
        render() {
          const { items } = this.state;
          return (
            <React.Fragment>
              <ClientSDKProvider client={fakeClient}>
                <AssetSearch
                  showLiveSearchResults={false}
                  onSearchResult={this.onSearchResult}
                />
              </ClientSDKProvider>
              <br />
              <p>
                Search results: [
                {items.map((item: Asset) => item.name).join(', ')}]
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
