import { Button, Icon, Input, Modal } from 'antd';
import AssetSearchForm from 'components/AssetSearchForm/AssetSearchForm';
import RootAssetSelect from 'components/RootAssetSelect/RootAssetSelect';
import { debounce } from 'lodash';
import React, { SyntheticEvent } from 'react';
import styled from 'styled-components';
import {
  VAsset,
  VId,
  VMetadata,
  VAdvancedSearch,
  VApiQuery,
  VOnAssetSearchResult,
  VOnAssetSearch,
  VIdCallback,
  VEmptyCallback,
} from 'utils/validators';

const { Search } = Input;

const InputGroup = styled(Input.Group)`
  display: flex !important;
  flex-grow: 1;
`;

const ButtonBlock = styled(Button)`
  width: 100%;
`;
const RootAssetSelectStyled = styled(RootAssetSelect)`
  width: 35%;
`;

export const defaultStrings: VMetadata = {
  changeSearch: 'Change search',
  clear: 'Clear',
  searchPlaceholder: 'Search for an asset',
  search: 'Search',
};

export interface AssetSearchProps {
  fetchingLimit: number;
  debounceTime: number;
  boostName: boolean;
  assets: VAsset[];
  strings: VMetadata;
  assetId?: VId;
  onSearchResults?: VOnAssetSearchResult;
  onSearch?: VOnAssetSearch;
  enableRootAssetSelect: boolean;
  enableAdvancedSearch: boolean;
  onAssetSelected?: VIdCallback;
  onFilterIconClick?: VEmptyCallback;
}

export interface AssetSearchState {
  assetId: VId;
  query: string;
  isModalOpen: boolean;
  advancedSearch: VAdvancedSearch | null;
}

class AssetSearch extends React.Component<AssetSearchProps, AssetSearchState> {
  static defaultProps = {
    fetchingLimit: 25,
    debounceTime: 200,
    boostName: true,
    enableAdvancedSearch: false,
    enableRootAssetSelect: false,
    strings: {},
  };

  onSearch = debounce(this.debouncedSearch.bind(this), this.props.debounceTime);

  constructor(props: AssetSearchProps) {
    super(props);
    this.state = {
      assetId: props.assetId || 0,
      query: '',
      isModalOpen: false,
      advancedSearch: null,
    };
  }

  debouncedSearch() {
    const { onSearch, boostName, fetchingLimit, onSearchResults } = this.props;
    const { query, advancedSearch, assetId } = this.state;
    const assetSubtrees = assetId ? [assetId] : null;

    const apiQuery: VApiQuery = {
      advancedSearch,
      fetchingLimit,
      assetSubtrees,
      boostName,
      query,
    };

    if (!query && !advancedSearch && onSearchResults) {
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
      advancedSearch: null,
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

  onAssetSelected = (assetId: VId) => {
    const { onAssetSelected } = this.props;

    if (onAssetSelected) {
      onAssetSelected(assetId);
    }

    this.setState({ assetId }, this.onSearch);
  };

  onAssetSearchChange = (value: VAdvancedSearch) =>
    this.setState({ advancedSearch: value, query: '' });

  onSearchQueryInput = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    this.setState({ query: target.value }, this.onSearch);
  };

  render() {
    const { assetId, query, isModalOpen, advancedSearch } = this.state;
    const { assets, strings, enableAdvancedSearch, enableRootAssetSelect } = this.props;
    const lang = { ...defaultStrings, ...strings };
    const { changeSearch, clear, searchPlaceholder, search } = lang;

    return (
      <React.Fragment>
        <InputGroup compact={true}>
          {enableRootAssetSelect &&
            <RootAssetSelectStyled
              onAssetSelected={this.onAssetSelected}
              assets={assets}
              assetId={assetId}
            />
          }
          {advancedSearch ? (
            <React.Fragment>
              <ButtonBlock type="primary" onClick={this.onFilterIconClick}>
                {changeSearch}
              </ButtonBlock>
              <Button htmlType="button" onClick={this.onModalCancel}>
                {clear}
              </Button>
            </React.Fragment>
          ) : (
            enableAdvancedSearch ? (
              <Input
                placeholder={searchPlaceholder}
                disabled={!!advancedSearch}
                value={query}
                onChange={this.onSearchQueryInput}
                allowClear={true}
                suffix={
                  <Icon
                    type="filter"
                    onClick={this.onFilterIconClick}
                    style={{ opacity: 0.6, marginLeft: 8 }}
                  />
                }
              />
            ) : (
              <Search
                placeholder={searchPlaceholder}
                disabled={!!advancedSearch}
                value={query}
                onChange={this.onSearchQueryInput}
                allowClear={true}
              />
            )
          )}
        </InputGroup>
        <Modal
          align={null}
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
            value={advancedSearch}
            onPressEnter={this.onModalOk}
            onChange={this.onAssetSearchChange}
          />
        </Modal>
      </React.Fragment>
    );
  }
}

export default AssetSearch;
