import React from 'react';

import {
  ERROR_API_UNEXPECTED_RESULTS,
  ERROR_NO_SDK_CLIENT,
} from '../../constants/errorMessages';
import { ClientSDKContext } from '../../context/clientSDKContext';
import { AssetsAPI } from '@cognite/sdk-alpha/dist/src/resources/assets/assetsApi';
import { Asset, AssetSearchFilter } from '@cognite/sdk-alpha/dist/src/types/types';


import { ApiQuery, Callback, PureObject } from '../../interfaces';
import {
  Search,
  SearchStyles as AssetSearchStyles,
} from '../common/Search/Search';
export type AssetSearchStyles = AssetSearchStyles;

type LiveSearchSelect = (asset: Asset) => void;
type SearchResultCallback = (assets: Asset[]) => void;

export const defaultStrings: PureObject = {
  searchPlaceholder: 'Search for an asset',
  emptyLiveSearch: 'Nothing found',
};

export interface AssetSearchProps {
  onLiveSearchSelect?: LiveSearchSelect;
  showLiveSearchResults?: boolean;
  onError?: Callback;
  strings?: PureObject;
  rootAssetSelect: boolean;
  advancedSearch: boolean;
  styles?: AssetSearchStyles;
  onSearchResult?: SearchResultCallback;
}

interface AssetSearchState {
  items: Asset[];
  loading: boolean;
}

let assetsApi: AssetsAPI;

export class AssetSearch extends React.Component<
  AssetSearchProps,
  AssetSearchState
> {
  static defaultProps = {
    rootAssetSelect: false,
    advancedSearch: false,
    showLiveSearchResults: true,
  };

  static contextType = ClientSDKContext;
  context!: React.ContextType<typeof ClientSDKContext>;

  constructor(props: AssetSearchProps) {
    super(props);
    this.state = {
      items: [],
      loading: false,
    };

    this.onSearch = this.onSearch.bind(this);
  }

  componentDidMount() {
    if (!this.context) {
      console.error(ERROR_NO_SDK_CLIENT);
      return;
    }
    assetsApi = this.context.assets;
  }

  async onSearch(query: ApiQuery) {
    const { onError, onSearchResult } = this.props;
    if (!query.query && !query.advancedSearch) {
      const items: Asset[] = [];
      this.setState({ items });
      if (onSearchResult) {
        onSearchResult(items);
      }
      return;
    }

    this.setState({ loading: true });

    const assetQuery: AssetSearchFilter = {
      filter: {
        // assetSubtrees is not supported yet.
        // assetSubtrees: query.assetSubtrees || undefined,
        metadata:
          (query.advancedSearch &&
            query.advancedSearch.metadata &&
            query.advancedSearch.metadata.reduce(
              (a, c) => ({ ...a, [c.key]: c.value }),
              {}
            )) ||
          undefined,
      },
      search: {
        name: (query.advancedSearch && query.advancedSearch.name) ? query.advancedSearch.name : (query.query || undefined),
        description: (query.advancedSearch && query.advancedSearch.description) ? query.advancedSearch.description : undefined
      },
      limit: query.fetchingLimit || undefined
    }
    try {
      const items = await assetsApi.search(assetQuery);
      if (!items || !Array.isArray(items)) {
        console.log(ERROR_API_UNEXPECTED_RESULTS);
        return;
      }
      this.setState({ items, loading: false });
      if (onSearchResult) {
        onSearchResult(items);
      }
    } catch (e) {
      if (onError) {
        onError(e);
      }
      this.setState({ items: [], loading: false });
    }
  }

  render() {
    const {
      showLiveSearchResults,
      rootAssetSelect,
      advancedSearch,
      strings,
      styles,
    } = this.props;
    const resultStrings = { ...defaultStrings, ...strings };
    const { items, loading } = this.state;
    const onLiveSearchSelect = showLiveSearchResults
      ? this.props.onLiveSearchSelect
      : undefined;

    return (
      <Search
        showLiveSearchResults={showLiveSearchResults}
        onSearch={this.onSearch}
        liveSearchResults={items}
        onLiveSearchSelect={onLiveSearchSelect}
        strings={resultStrings}
        loading={loading}
        rootAssetSelect={rootAssetSelect}
        advancedSearch={advancedSearch}
        styles={styles}
      />
    );
  }
}
