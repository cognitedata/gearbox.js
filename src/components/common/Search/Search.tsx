import { Asset } from '@cognite/sdk';
import { Button, Icon, Input, Modal } from 'antd';
import { debounce } from 'lodash';
import React, { KeyboardEvent, SyntheticEvent } from 'react';
import styled from 'styled-components';
import {
  AdvancedSearch,
  ApiQuery,
  Callback,
  EmptyCallback,
  IdCallback,
  OnClick,
  PureObject,
} from '../../../interfaces';
import { RootAssetSelect } from '../RootAssetSelect/RootAssetSelect';
import { SearchForm } from './SearchForm/SearchForm';

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

      &.active {
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
  emptyLiveSearch: 'Nothing found',
};

export interface SearchProps {
  fetchingLimit: number;
  debounceTime: number;
  loading: boolean;
  rootAssetSelect: boolean;
  advancedSearch: boolean;
  liveSearch: boolean;
  strings: PureObject;
  assets: Asset[];
  liveSearchResults: any[];
  assetId?: number;
  onSearch?: Callback;
  onAssetSelected?: IdCallback;
  onFilterIconClick?: EmptyCallback;
  onLiveSearchSelect?: Callback;
  onKeyDown?: (e: KeyboardEvent) => void;
}

interface SearchState {
  assetId: number;
  query: string;
  isModalOpen: boolean;
  advancedSearchQuery: AdvancedSearch | null;
  liveSearchResults: any[];
  liveSearchShow: boolean;
  cursor?: number;
}

export class Search extends React.Component<SearchProps, SearchState> {
  static defaultProps = {
    assets: [],
    liveSearchResults: [],
    fetchingLimit: 25,
    debounceTime: 200,
    loading: false,
    advancedSearch: false,
    rootAssetSelect: false,
    liveSearch: false,
    strings: {},
  };

  static getDerivedStateFromProps(props: SearchProps, state: SearchState) {
    const { liveSearch, liveSearchResults: propsSearchResults } = props;
    const { liveSearchResults: stateSearchResults, query } = state;

    if (!liveSearch) {
      return null;
    }

    if (propsSearchResults !== stateSearchResults) {
      return {
        liveSearchResults: propsSearchResults,
        liveSearchShow: !!query,
      };
    }

    return null;
  }

  onSearchBlurBounded: OnClick;

  onSearch = debounce(this.debouncedSearch.bind(this), this.props.debounceTime);

  private lang: PureObject = {};

  constructor(props: SearchProps) {
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
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  debouncedSearch() {
    const { onSearch, fetchingLimit } = this.props;
    const { query, advancedSearchQuery, assetId } = this.state;
    const assetSubtrees = assetId ? [assetId] : null;

    const apiQuery: ApiQuery = {
      advancedSearch: advancedSearchQuery,
      fetchingLimit,
      assetSubtrees,
      query,
    };

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
    this.setState({
      advancedSearchQuery: null,
      isModalOpen: false,
      query: '',
    });
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

  onSearchChange = (value: AdvancedSearch) =>
    this.setState({ advancedSearchQuery: value, query: '' });

  onSearchQueryInput = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    this.setState(
      { query: target.value, liveSearchShow: false },
      this.onSearch
    );
  };

  onKeyDown = (e: KeyboardEvent) => {
    const { liveSearch, onKeyDown } = this.props;
    const { cursor, liveSearchResults, liveSearchShow } = this.state;

    if (onKeyDown) {
      onKeyDown(e);
    }
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
    }

    if (!liveSearch || !liveSearchShow) {
      return;
    }

    // Arrow up
    if (e.keyCode === 38) {
      if (cursor === undefined || cursor === 0) {
        this.setState({ cursor: liveSearchResults.length - 1 });
      } else {
        this.setState({ cursor: cursor - 1 });
      }
      return;
    }

    // Arrow down
    if (e.keyCode === 40) {
      if (cursor === undefined || cursor === liveSearchResults.length - 1) {
        this.setState({ cursor: 0 });
      } else {
        this.setState({ cursor: cursor + 1 });
      }
      return;
    }

    // Enter
    if (e.keyCode === 13 && cursor !== undefined) {
      const item = liveSearchResults[cursor];
      this.onLiveSearchClick(item);
    }
  };

  render() {
    const { assetId, query, isModalOpen, advancedSearchQuery } = this.state;
    const { assets, advancedSearch, rootAssetSelect, strings } = this.props;

    this.lang = { ...defaultStrings, ...strings };

    const { changeSearch, clear, searchPlaceholder, search } = this.lang;

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
                  onKeyDown={this.onKeyDown}
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
                  onKeyDown={this.onKeyDown}
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
          <SearchForm
            value={advancedSearchQuery}
            onPressEnter={this.onModalOk}
            onChange={this.onSearchChange}
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
    const { liveSearchShow, cursor } = this.state;
    const { emptyLiveSearch } = this.lang;
    if (!liveSearch || !liveSearchShow) {
      return null;
    }

    const list = liveSearchResults.length ? (
      liveSearchResults.map((item, index) => (
        <li
          onMouseDown={() => this.onLiveSearchClick(item)}
          key={index}
          className={cursor === index ? 'active' : undefined}
        >
          {item.name || 'NaN'}
        </li>
      ))
    ) : (
      <li>
        <i>{emptyLiveSearch}</i>
      </li>
    );

    return (
      <LiveSearchWrapper>
        <ul data-id={'live-search-list'}>{list}</ul>
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

  private onLiveSearchClick(item: any) {
    const { onLiveSearchSelect } = this.props;

    if (onLiveSearchSelect) {
      onLiveSearchSelect(item);
    }

    this.setState({
      query: item.name,
      liveSearchShow: false,
      cursor: undefined,
    });
  }
}
