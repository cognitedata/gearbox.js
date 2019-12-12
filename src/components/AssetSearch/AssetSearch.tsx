import React, { Component } from 'react';

import { Asset, AssetSearchFilter } from '@cognite/sdk';
import { AssetsAPI } from '@cognite/sdk/dist/src/resources/assets/assetsApi';
import {
  ERROR_API_UNEXPECTED_RESULTS,
  ERROR_NO_SDK_CLIENT,
} from '../../constants/errorMessages';
import { ClientSDKContext } from '../../context/clientSDKContext';

import { ApiQuery, Callback, PureObject } from '../../interfaces';
import { Search, SearchStyles } from '../common/Search/Search';
export type AssetSearchStyles = SearchStyles;

type LiveSearchSelect = (asset: Asset) => void;
type SearchResultCallback = (assets: Asset[]) => void;

export const defaultStrings: PureObject = {
  searchPlaceholder: 'Search for an asset',
  emptyLiveSearch: 'Nothing found',
};

export interface AssetSearchProps {
  /**
   * Triggers after selecting one of items from live search results list.
   * Required when showLiveSearchResults == true
   */
  onLiveSearchSelect?: LiveSearchSelect;
  /**
   * flag to show live search results in dropdown list
   */
  showLiveSearchResults?: boolean;
  /**
   * Triggers when search error occurs
   */
  onError?: Callback;
  /**
   * Object of strings to be placed in component
   */
  strings?: PureObject;
  /**
   * Enable root asset selection
   */
  rootAssetSelect: boolean;
  /**
   * Enable root advanced search
   */
  advancedSearch: boolean;
  /**
   * Custom styles
   */
  styles?: AssetSearchStyles;
  /**
   * Triggers when search request finishes
   */
  onSearchResult?: SearchResultCallback;
}

interface AssetSearchState {
  items: Asset[];
  loading: boolean;
}

export class AssetSearch extends Component<AssetSearchProps, AssetSearchState> {
  static defaultProps = {
    rootAssetSelect: false,
    advancedSearch: false,
    showLiveSearchResults: true,
  };

  static contextType = ClientSDKContext;
  context!: React.ContextType<typeof ClientSDKContext>;
  assetsApi!: AssetsAPI;

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
    this.assetsApi = this.context.assets;
  }

  generateSearchQuery = (query: ApiQuery) => ({
    search: {
      name: query.query,
      description:
        (query.advancedSearch && query.advancedSearch.description) || undefined,
    },
    filter: {
      parentIds: query.assetSubtrees || undefined,
      metadata:
        (query.advancedSearch &&
          query.advancedSearch.metadata &&
          query.advancedSearch.metadata.reduce(
            (a, c) => (c.key ? { ...a, [c.key]: c.value } : a),
            {}
          )) ||
        undefined,
    },
  });

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
    const assetQuery: AssetSearchFilter = this.generateSearchQuery(query);
    try {
      const items = await this.assetsApi.search(assetQuery);
      if (!items || !Array.isArray(items)) {
        console.error(ERROR_API_UNEXPECTED_RESULTS, items);
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
