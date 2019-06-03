import * as sdk from '@cognite/sdk';
import React from 'react';
import { ApiQuery, Callback, PureObject } from '../../interfaces';
import {
  Search,
  SearchStyles as AssetSearchStyles,
} from '../common/Search/Search';
export type AssetSearchStyles = AssetSearchStyles;

type LiveSearchSelect = (asset: sdk.Asset) => void;

export const defaultStrings: PureObject = {
  searchPlaceholder: 'Search for an asset',
  emptyLiveSearch: 'Nothing found',
};

export interface AssetSearchProps {
  onLiveSearchSelect: LiveSearchSelect;
  onError?: Callback;
  strings?: PureObject;
  rootAssetSelect: boolean;
  advancedSearch: boolean;
  styles?: AssetSearchStyles;
}

interface AssetSearchState {
  items: sdk.Asset[];
  loading: boolean;
}

export class AssetSearch extends React.Component<
  AssetSearchProps,
  AssetSearchState
> {
  static defaultProps = {
    rootAssetSelect: false,
    advancedSearch: false,
  };
  constructor(props: AssetSearchProps) {
    super(props);
    this.state = {
      items: [],
      loading: false,
    };

    this.onSearch = this.onSearch.bind(this);
  }

  async onSearch(query: ApiQuery) {
    const { onError } = this.props;
    if (!query.query && !query.advancedSearch) {
      return this.setState({ items: [] });
    }

    this.setState({ loading: true });
    const assetQuery: sdk.AssetSearchParams = {
      query: query.query,
      assetSubtrees: query.assetSubtrees || undefined,
      description:
        (query.advancedSearch && query.advancedSearch.description) || undefined,
      metadata:
        (query.advancedSearch &&
          query.advancedSearch.metadata &&
          query.advancedSearch.metadata.reduce(
            (a, c) => ({ ...a, [c.key]: c.value }),
            {}
          )) ||
        undefined,
    };
    try {
      const { items } = await sdk.Assets.search(assetQuery);
      this.setState({ items, loading: false });
    } catch (e) {
      if (onError) {
        onError(e);
      }

      this.setState({ items: [], loading: false });
    }
  }

  render() {
    const {
      onLiveSearchSelect,
      rootAssetSelect,
      advancedSearch,
      strings,
      styles,
    } = this.props;
    const resultStrings = { ...defaultStrings, ...strings };
    const { items, loading } = this.state;

    return (
      <Search
        liveSearch={true}
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
