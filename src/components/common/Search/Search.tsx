import { Button, Icon, Input, Modal } from 'antd';
import { NativeButtonProps } from 'antd/lib/button/button';
import { debounce } from 'lodash';
import React, { KeyboardEvent, SyntheticEvent } from 'react';
import styled from 'styled-components';
import { withDefaultTheme } from '../../../hoc/withDefaultTheme';
import {
  AdvancedSearch,
  AnyIfEmpty,
  ApiQuery,
  Callback,
  EmptyCallback,
  IdCallback,
  OnClick,
  PureObject,
} from '../../../interfaces';
import { defaultTheme } from '../../../theme/defaultTheme';
import {
  defaultStrings as rootAssetSelectStrings,
  RootAssetSelect,
} from '../RootAssetSelect/RootAssetSelect';
import { SearchForm } from './SearchForm/SearchForm';

export const defaultStrings: PureObject = {
  changeSearch: 'Change search',
  clear: 'Clear',
  searchPlaceholder: 'Search for an asset',
  search: 'Search',
  emptyLiveSearch: 'Nothing found',
  rootAssetSelectLoading: rootAssetSelectStrings.loading,
  rootAssetSelectAll: rootAssetSelectStrings.all,
};

export interface SearchStyles {
  rootAssetSelect?: React.CSSProperties;
  advancedSearchButton?: React.CSSProperties;
  searchResultList?: {
    container?: React.CSSProperties;
    listItem?: React.CSSProperties;
  };
  advancedSearch?: {
    modalBody?: React.CSSProperties;
    searchButton?: React.CSSProperties;
    clearButton?: React.CSSProperties;
    searchForm?: {
      container?: React.CSSProperties;
      addMoreMetadataButton?: React.CSSProperties;
    };
  };
}

export interface SearchProps {
  fetchingLimit: number;
  debounceTime: number;
  loading: boolean;
  rootAssetSelect: boolean;
  advancedSearch: boolean;
  showLiveSearchResults: boolean;
  strings: PureObject;
  liveSearchResults: any[];
  assetId?: number;
  onSearch?: Callback;
  onAssetSelected?: IdCallback;
  onFilterIconClick?: EmptyCallback;
  onLiveSearchSelect?: Callback;
  onKeyDown?: (e: KeyboardEvent) => void;
  styles?: SearchStyles;
  theme?: AnyIfEmpty<{}>;
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

class Search extends React.Component<SearchProps, SearchState> {
  static defaultProps = {
    liveSearchResults: [],
    fetchingLimit: 25,
    debounceTime: 200,
    loading: false,
    advancedSearch: false,
    rootAssetSelect: false,
    showLiveSearchResults: false,
    strings: {},
    theme: { ...defaultTheme },
  };

  static getDerivedStateFromProps(props: SearchProps, state: SearchState) {
    const {
      showLiveSearchResults,
      liveSearchResults: propsSearchResults,
    } = props;
    const { liveSearchResults: stateSearchResults, query } = state;

    if (!showLiveSearchResults) {
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
    const { showLiveSearchResults, onKeyDown } = this.props;
    const { cursor, liveSearchResults, liveSearchShow } = this.state;

    if (onKeyDown) {
      onKeyDown(e);
    }
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
    }

    if (!showLiveSearchResults || !liveSearchShow) {
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
    const { advancedSearch, rootAssetSelect, strings, styles } = this.props;

    const lang = { ...defaultStrings, ...strings };
    const {
      changeSearch,
      clear,
      searchPlaceholder,
      search,
      rootAssetSelectLoading,
      rootAssetSelectAll,
    } = lang;
    return (
      <React.Fragment>
        <InputGroup compact={true}>
          {rootAssetSelect && (
            // @ts-ignore
            <RootAssetSelectStyled
              onAssetSelected={this.onAssetSelected}
              assetId={assetId}
              strings={{
                loading: rootAssetSelectLoading,
                all: rootAssetSelectAll,
              }}
              styles={{
                select: styles && styles.rootAssetSelect,
              }}
            />
          )}
          {advancedSearchQuery ? (
            <React.Fragment>
              <ChangeSearchButton
                style={styles && styles.advancedSearchButton}
                type="primary"
                onClick={this.onFilterIconClick}
              >
                {changeSearch}
              </ChangeSearchButton>
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
            </React.Fragment>
          )}
          {this.renderLiveSearch(lang)}
        </InputGroup>
        <Modal
          visible={isModalOpen}
          onCancel={this.onModalCancel}
          bodyStyle={
            styles && styles.advancedSearch && styles.advancedSearch.modalBody
          }
          footer={[
            <Button
              htmlType="button"
              key="cancel"
              onClick={this.onModalCancel}
              style={
                styles &&
                styles.advancedSearch &&
                styles.advancedSearch.clearButton
              }
            >
              {clear}
            </Button>,
            <Button
              htmlType="button"
              key="search"
              type="primary"
              onClick={this.onModalOk}
              style={
                styles &&
                styles.advancedSearch &&
                styles.advancedSearch.searchButton
              }
            >
              {search}
            </Button>,
          ]}
        >
          <SearchForm
            value={advancedSearchQuery}
            onPressEnter={this.onModalOk}
            onChange={this.onSearchChange}
            styles={
              styles &&
              styles.advancedSearch &&
              styles.advancedSearch.searchForm
            }
          />
        </Modal>
      </React.Fragment>
    );
  }

  onMouseOver = (index: number) => {
    this.setState({ cursor: index });
  };

  private onSearchBlur() {
    this.setState({ liveSearchShow: false });
  }

  private renderLiveSearch(strings: PureObject) {
    const { showLiveSearchResults, liveSearchResults, styles } = this.props;
    const { liveSearchShow, cursor } = this.state;
    const { emptyLiveSearch } = strings;

    if (!showLiveSearchResults || !liveSearchShow) {
      return null;
    }

    const list = liveSearchResults.length ? (
      liveSearchResults.map((item, index) => (
        <li
          onMouseOver={() => this.onMouseOver(index)}
          onMouseDown={() => this.onLiveSearchClick(item)}
          key={index}
          className={cursor === index ? 'active' : undefined}
          style={
            styles &&
            styles.searchResultList &&
            styles.searchResultList.listItem
          }
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
      <LiveSearchWrapper
        style={
          styles && styles.searchResultList && styles.searchResultList.container
        }
      >
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

const InputGroup = styled(Input.Group)`
  display: flex !important;
  flex-grow: 1;
  overflow: visible;
  position: relative;

  > span {
    z-index: 1;
  }
`;

const ChangeSearchButton = styled((props: NativeButtonProps) => (
  <Button {...props} />
))`
  width: 100%;
`;

const RootAssetSelectStyled = styled(RootAssetSelect)`
  width: 35%;
`;

const LiveSearchWrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 0px;
  width: 100%;
  background-color: ${({ theme }) => theme.gearbox.white};
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

      &.active {
        background-color: green;
      }
    }
  }
`;

const Component = withDefaultTheme(Search);
Component.displayName = 'Search';

export { Component as Search };
