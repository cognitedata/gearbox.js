import { Button, Icon, Input, Modal } from 'antd';
import { debounce } from 'lodash';
import React, { SyntheticEvent } from 'react';
import styled from 'styled-components';
import { Asset } from '@cognite/sdk';
import { AssetSearchForm } from '../AssetSearchForm/AssetSearchForm';
import { RootAssetSelect } from '../RootAssetSelect/RootAssetSelect';
import {
  PureObject,
  AdvancedAssetSearch,
  ApiQuery,
  OnAssetSearchResult,
  OnAssetSearch,
  IdCallback,
  EmptyCallback,
  OnClick,
  AnyTypeCallback,
} from '../../interfaces';

const InputGroup = styled(Input.Group)`
  display: flex !important;
  flex-grow: 1;
  overflow: visible;
  position: relative;

  > span {
    z-index: 1;
  }
`;

const RootAssetSelectStyled = styled(RootAssetSelect)`
  width: 35%;
`;

const LiveSearchWrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 0px;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 1px 5px -2px rgba(0, 0, 0, 0.5);
  border-radius: 0;

  > ul {
    margin: 0;
    padding: 0;
    list-style: none;
    line-height: 1.9;

    > li {
      padding: 0 10px;
      cursor: pointer;
      &:hover {
        background-color: #eeeeee;
      }
    }
  }
`;

export const defaultStrings: PureObject = {
  changeSearch: 'Change search',
  clear: 'Clear',
  searchPlaceholder: 'Search for an asset',
  search: 'Search',
};

export interface AssetSearchProps {
  fetchingLimit: number;
  debounceTime: number;
  loading: boolean;
  boostName: boolean;
  rootAssetSelect: boolean;
  advancedSearch: boolean;
  liveSearch: boolean;
  strings: PureObject;
  assets: Asset[];
  liveSearchResults: any[];
  assetId?: number;
  onSearchResults?: OnAssetSearchResult;
  onSearch?: OnAssetSearch;
  onAssetSelected?: IdCallback;
  onFilterIconClick?: EmptyCallback;
  onLiveSearchSelect?: AnyTypeCallback;
}

export interface AssetSearchState {
  assetId: number;
  query: string;
  isModalOpen: boolean;
  advancedSearchQuery: AdvancedAssetSearch | null;
  liveSearchResults: any[];
  liveSearchShow: boolean;
}

export class AssetSearch extends React.Component<
  AssetSearchProps,
  AssetSearchState
> {
  static defaultProps = {
    assets: [],
    liveSearchResults: [],
    fetchingLimit: 25,
    debounceTime: 200,
    loading: false,
    boostName: true,
    advancedSearch: false,
    rootAssetSelect: false,
    liveSearch: false,
    strings: {},
  };

  static getDerivedStateFromProps(
    props: AssetSearchProps,
    state: AssetSearchState
  ) {
    const { liveSearch, liveSearchResults: propsSearchResults } = props;
    const { liveSearchResults: stateSearchResults } = state;

    if (!liveSearch) {
      return null;
    }

    if (propsSearchResults !== stateSearchResults) {
      return {
        liveSearchResults: propsSearchResults,
        liveSearchShow: !!propsSearchResults.length,
      };
    }

    return null;
  }

  onSearchBlurBounded: OnClick;

  onSearch = debounce(this.debouncedSearch.bind(this), this.props.debounceTime);

  constructor(props: AssetSearchProps) {
    super(props);
    this.state = {
      assetId: props.assetId || 0,
      query: '',
      isModalOpen: false,
      advancedSearchQuery: null,
      liveSearchResults: [],
      liveSearchShow: false,
    };

    this.onSearchBlurBounded = this.onSearchBlur.bind(this);
  }

  debouncedSearch() {
    const { onSearch, boostName, fetchingLimit, onSearchResults } = this.props;
    const { query, advancedSearchQuery, assetId } = this.state;
    const assetSubtrees = assetId ? [assetId] : null;

    const apiQuery: ApiQuery = {
      advancedSearch: advancedSearchQuery,
      fetchingLimit,
      assetSubtrees,
      boostName,
      query,
    };

    if (!query && !advancedSearchQuery && onSearchResults) {
      onSearchResults(null, apiQuery);

      return;
    }

    if (onSearch) {
      onSearch(apiQuery);
    }
  }

  onFilterIconClick = () => {
    const { onFilterIconClick } = this.props;

    if (onFilterIconClick) {
      onFilterIconClick();
    }

    this.setState({
      isModalOpen: true,
    });
  };

  onModalCancel = () => {
    const { onSearchResults } = this.props;

    this.setState({
      advancedSearchQuery: null,
      isModalOpen: false,
      query: '',
    });

    if (onSearchResults) {
      onSearchResults(null);
    }
  };

  onModalOk = () => {
    this.setState({ isModalOpen: false }, this.onSearch);
  };

  onAssetSelected = (assetId: number) => {
    const { onAssetSelected } = this.props;

    if (onAssetSelected) {
      onAssetSelected(assetId);
    }

    this.setState({ assetId }, this.onSearch);
  };

  onAssetSearchChange = (value: AdvancedAssetSearch) =>
    this.setState({ advancedSearchQuery: value, query: '' });

  onSearchQueryInput = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    this.setState(
      { query: target.value, liveSearchShow: false },
      this.onSearch
    );
  };

  render() {
    const { assetId, query, isModalOpen, advancedSearchQuery } = this.state;
    const { assets, strings, advancedSearch, rootAssetSelect } = this.props;
    const lang = { ...defaultStrings, ...strings };
    const { changeSearch, clear, searchPlaceholder, search } = lang;

    return (
      <React.Fragment>
        <InputGroup compact={true}>
          {rootAssetSelect && (
            <RootAssetSelectStyled
              onAssetSelected={this.onAssetSelected}
              assets={assets}
              assetId={assetId}
            />
          )}
          {advancedSearchQuery ? (
            <React.Fragment>
              <Button
                style={{ width: '100%' }}
                type="primary"
                onClick={this.onFilterIconClick}
              >
                {changeSearch}
              </Button>
              <Button htmlType="button" onClick={this.onModalCancel}>
                {clear}
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {advancedSearch ? (
                <Input
                  placeholder={searchPlaceholder as string}
                  disabled={!!advancedSearchQuery}
                  value={query}
                  onChange={this.onSearchQueryInput}
                  allowClear={true}
                  onBlur={this.onSearchBlurBounded}
                  suffix={this.toggleInputIcon(
                    'filter',
                    query,
                    this.onFilterIconClick
                  )}
                />
              ) : (
                <Input
                  placeholder={searchPlaceholder as string}
                  disabled={!!advancedSearchQuery}
                  value={query}
                  onChange={this.onSearchQueryInput}
                  allowClear={true}
                  onBlur={this.onSearchBlurBounded}
                  suffix={this.toggleInputIcon('search', query)}
                />
              )}
              {this.renderLiveSearch()}
            </React.Fragment>
          )}
        </InputGroup>
        <Modal
          visible={isModalOpen}
          onCancel={this.onModalCancel}
          footer={[
            <Button htmlType="button" key="cancel" onClick={this.onModalCancel}>
              {clear}
            </Button>,
            <Button
              htmlType="button"
              key="search"
              type="primary"
              onClick={this.onModalOk}
            >
              {search}
            </Button>,
          ]}
        >
          <AssetSearchForm
            value={advancedSearchQuery}
            onPressEnter={this.onModalOk}
            onChange={this.onAssetSearchChange}
          />
        </Modal>
      </React.Fragment>
    );
  }

  private onSearchBlur() {
    this.setState({ liveSearchShow: false });
  }

  private renderLiveSearch() {
    const { liveSearch, liveSearchResults } = this.props;
    const { liveSearchShow } = this.state;

    if (!liveSearch || !liveSearchShow) {
      return null;
    }

    const list = liveSearchResults.map((item, index) => (
      <li onMouseDown={e => this.onLiveSearchClick(e, item)} key={index}>
        {item.name}
      </li>
    ));

    return (
      <LiveSearchWrapper>
        <ul>{list}</ul>
      </LiveSearchWrapper>
    );
  }

  private toggleInputIcon(
    iconType: string,
    searchQuery: string,
    onClick?: OnClick
  ) {
    const { loading } = this.props;

    return searchQuery ? (
      loading ? (
        <Icon type="loading" style={{ marginLeft: 8 }} />
      ) : null
    ) : (
      <Icon
        type={iconType}
        style={{ opacity: 0.6, marginLeft: 8 }}
        onClick={onClick}
      />
    );
  }

  private onLiveSearchClick(e: SyntheticEvent, item: any) {
    e.preventDefault();

    const { onLiveSearchSelect } = this.props;

    if (onLiveSearchSelect) {
      onLiveSearchSelect(item);
    }

    this.setState({ query: item.name, liveSearchShow: false });
  }
}
