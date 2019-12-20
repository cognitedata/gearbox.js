import { Asset, AssetListScope, AssetSearchFilter } from '@cognite/sdk';
import { pick } from 'lodash';
import React from 'react';
import { assetsList } from '../../../mocks';
import { MockCogniteClient } from '../../../utils/mockSdk';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { AssetSearchStyles } from '../AssetSearch';

class CogniteClient extends MockCogniteClient {
  assets: any = {
    // @ts-ignore
    list: (scope: AssetListScope) => {
      console.log('assets.list', scope);
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
      return { items };
    },
    // @ts-ignore
    search: (query: AssetSearchFilter) => {
      console.log('Assets.search', query);
      if (query.search && query.search.name === 'empty') {
        return [];
      }

      if (query.search && query.search.name === 'error') {
        throw { message: 'sdk search request failed' };
      }
      return assetsList.map(asset =>
        pick(asset, [
          'id',
          'name',
          'description',
          'lastUpdatedTime',
          'createdTime',
        ])
      );
    },
  };
}

const client = new CogniteClient({ appId: 'gearbox test' });

export const decorators = [
  (storyFn: any) => (
    <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
  ),
];

export const onLiveSearchSelect = (asset: Asset) => console.log(asset);

export const onError = (error: any): void => console.log(error);

export const onSearchResult = (assets: Asset[]): void => console.log(assets);

export const heightProp = '100px';

export const strings = {
  searchPlaceholder: 'Asset name',
  emptyLiveSearch: 'No results',
};

export const styles: AssetSearchStyles = {
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
