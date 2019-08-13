import {
  Asset,
  AssetListScope,
  AssetSearchFilter,
} from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { pick } from 'lodash';
import React from 'react';
import { assetsList } from '../../../mocks';
import { MockCogniteClient } from '../../../utils/mockSdk';
import { ClientSDKProvider } from '../../ClientSDKProvider';
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
class CogniteClient extends MockCogniteClient {
  assets: any = {
    // @ts-ignore
    list: (scope: AssetListScope) => {
      action('assets.list')(scope);
      // @ts-ignore
      // pick only required fields
      const items: Asset[] = assetsList.map(asset =>
        pick(asset, [
          'id',
          'name',
          'description',
          'lastUpdatedTime',
          'createdTime',
        ])
      );
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ items });
        });
      });
    },
    // @ts-ignore
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

      // @ts-ignore
      const items: Asset[] = assetsList.map(asset =>
        pick(asset, [
          'id',
          'name',
          'description',
          'lastUpdatedTime',
          'createdTime',
        ])
      );
      // tslint:disable-next-line: no-identical-functions
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(items);
        });
      });
    },
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

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
    <ClientSDKProvider client={sdk}>
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
      <ClientSDKProvider client={sdk}>
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
      <ClientSDKProvider client={sdk}>
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
      <ClientSDKProvider client={sdk}>
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
  .add(
    'Root asset select',
    () => (
      <ClientSDKProvider client={sdk}>
        <AssetSearch
          onLiveSearchSelect={onLiveSearchSelect}
          rootAssetSelect={true}
        />
      </ClientSDKProvider>
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
      <ClientSDKProvider client={sdk}>
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
        <ClientSDKProvider client={sdk}>
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
      // tslint:disable-next-line: max-classes-per-file
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
              <ClientSDKProvider client={sdk}>
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
