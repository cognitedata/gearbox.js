import * as sdk from '@cognite/sdk';
import React from 'react';
import { PureObject } from '../../interfaces';
import { Callback } from '../../interfaces';
import { Search } from '../common/Search/Search';

type onSearchCallback = (query: sdk.AssetSearchParams) => void;

type LiveSearchSelect = (asset: sdk.Asset) => void;

export const defaultStrings: PureObject = {
  searchPlaceholder: 'Search for an asset',
  emptyLiveSearch: 'Nothing found',
};

export interface AssetSearchProps {
  onLiveSearchSelect: LiveSearchSelect;
  onError?: Callback;
  strings?: PureObject;
}

interface AssetSearchState {
  items: sdk.Asset[];
  loading: boolean;
}

export class AssetSearch extends React.Component<
  AssetSearchProps,
  AssetSearchState
> {
  onSearchBounded: onSearchCallback;

  constructor(props: AssetSearchProps) {
    super(props);
    this.state = {
      items: [],
      loading: false,
    };

    this.onSearchBounded = this.onSearch.bind(this);
  }

  async onSearch(query: sdk.AssetSearchParams) {
    const { onError } = this.props;

    if (!query.query) {
      return this.setState({ items: [] });
    }

    this.setState({ loading: true });

    try {
      const { items } = await sdk.Assets.search(query);

      this.setState({ items, loading: false });
    } catch (e) {
      if (onError) {
        onError(e);
      }

      this.setState({ items: [], loading: false });
    }
  }

  render() {
    const { onLiveSearchSelect, strings } = this.props;
    const resultStrings = { ...defaultStrings, ...strings };
    const { items, loading } = this.state;

    return (
      <Search
        liveSearch={true}
        onSearch={this.onSearchBounded}
        liveSearchResults={items}
        onLiveSearchSelect={onLiveSearchSelect}
        strings={resultStrings}
        loading={loading}
      />
    );
  }
}
