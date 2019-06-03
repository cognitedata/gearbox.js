import * as sdk from '@cognite/sdk';
import { Button, Spin } from 'antd';
import { NativeButtonProps } from 'antd/lib/button/button';
import { debounce } from 'lodash';
import React, { KeyboardEvent } from 'react';
import styled from 'styled-components';
import { ApiQuery, PureObject } from '../../interfaces';
import { DetailCheckbox } from '../common/DetailCheckbox/DetailCheckbox';
import { defaultStrings as rootAssetSelectStrings } from '../common/RootAssetSelect/RootAssetSelect';
import { Search } from '../common/Search/Search';
import { Item, SelectedItems } from './SelectedItems';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 8px;
  width: 100%;
  height: auto;
  overflow: auto;
`;

const CenteredSpin = styled(Spin)`
  &.ant-spin-spinning {
    min-height: 25px;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const ButtonRow = styled.div`
  margin-top: 5px;
`;

const SelectAllButton = styled((props: NativeButtonProps) => (
  <Button {...props} />
))``;

const SelectNoneButton = styled((props: NativeButtonProps) => (
  <Button {...props} />
))`
  margin-left: 10px;
`;

export interface TimeseriesSearchStyles {
  buttonRow?: React.CSSProperties;
  list?: React.CSSProperties;
  selectAllButton?: React.CSSProperties;
  selectNoneButton?: React.CSSProperties;
}

export interface TimeseriesSearchProps {
  selectedTimeseries: number[];
  single: boolean;

  hideSelected: boolean;
  allowStrings: boolean;
  onTimeserieSelectionChange: (
    newTimeseriesIds: number[],
    selectedTimeseries: sdk.Timeseries | null
  ) => void;
  rootAsset?: number;
  filterRule?: (timeseries: sdk.Timeseries) => boolean;
  onError?: (error: Error) => void;
  styles?: TimeseriesSearchStyles;
  rootAssetSelect: boolean;
  strings: PureObject;
}
export const defaultStrings: PureObject = {
  searchPlaceholder: 'Search for timeseries',
  selectAll: 'Select all',
  selectNone: 'Select none',
  rootAssetSelectAll: rootAssetSelectStrings.all,
  rootAssetSelectLoading: rootAssetSelectStrings.loading,
};

interface TimeseriesSearchState {
  assetId?: number;
  fetching: boolean;
  searchResults: sdk.Timeseries[];
  selectedTimeseries: sdk.Timeseries[];
  lastFetchId: number;
  cursor?: number;
}

export class TimeseriesSearch extends React.Component<
  TimeseriesSearchProps,
  TimeseriesSearchState
> {
  static defaultProps = {
    selectedTimeseries: [],
    strings: {},
    filterRule: undefined,
    hideSelected: false,
    allowStrings: false,
    rootAssetSelect: false,
    single: false,
    onError: undefined,
    rootAsset: undefined,
  };

  static getDerivedStateFromProps(
    props: TimeseriesSearchProps,
    state: TimeseriesSearchState
  ) {
    if (props.rootAsset !== null && props.rootAsset !== state.assetId) {
      return { assetId: props.rootAsset };
    }
    return null;
  }

  constructor(props: TimeseriesSearchProps) {
    super(props);
    this.state = {
      assetId: props.rootAsset || undefined,
      fetching: false,
      searchResults: [],
      selectedTimeseries: [],
      lastFetchId: 0,
    };
    this.fetchTimeseries = debounce(this.fetchTimeseries, 200, {
      leading: false,
      trailing: true,
    });
  }

  async componentDidMount() {
    const { selectedTimeseries } = this.props;
    if (selectedTimeseries && selectedTimeseries.length > 0) {
      const timeseries = await sdk.TimeSeries.retrieveMultiple(
        selectedTimeseries
      );
      this.setState({ selectedTimeseries: timeseries });
    }
  }

  onSelectAsset = (assetId: number): void => {
    this.setState({ assetId, searchResults: [] });
  };

  onTimeSerieClicked = (timeseries: sdk.Timeseries): void => {
    const { allowStrings, single, onTimeserieSelectionChange } = this.props;
    if (!allowStrings && timeseries.isString) {
      return;
    }

    let newTimeseries: sdk.Timeseries[] = [];
    if (single) {
      newTimeseries = [timeseries];
    } else if (!this.isChecked(timeseries.id)) {
      newTimeseries = [...this.state.selectedTimeseries, timeseries];
    } else {
      newTimeseries = [...this.state.selectedTimeseries].filter(
        existing => existing.id !== timeseries.id
      );
    }
    this.setState({ selectedTimeseries: newTimeseries });

    onTimeserieSelectionChange(newTimeseries.map(x => x.id), timeseries);
  };

  fetchTimeseries = (apiQuery: ApiQuery): void => {
    const { query, assetSubtrees } = apiQuery;
    let { lastFetchId } = this.state;
    lastFetchId += 1;
    const fetchId = lastFetchId;
    this.setState({ fetching: true, lastFetchId });

    if (!query) {
      this.setState({
        fetching: false,
        searchResults: [],
      });
      return;
    }

    sdk.TimeSeries.search({
      assetSubtrees: assetSubtrees == null ? undefined : assetSubtrees,
      query,
      limit: 100,
    })
      .then(
        (data: sdk.TimeseriesWithCursor): void => {
          if (fetchId !== this.state.lastFetchId) {
            // for fetch callback order
            return;
          }

          const { items } = data;
          if (this.props.filterRule) {
            const resultsFiltered = items.filter(this.props.filterRule);
            this.setState({
              searchResults: resultsFiltered,
              fetching: false,
            });
          } else {
            this.setState({
              searchResults: items,
              fetching: false,
            });
          }
        }
      )
      .catch(
        (error: Error): void => {
          this.setState({
            fetching: false,
          });
          const { onError } = this.props;
          if (onError) {
            onError(error);
          }
        }
      );
  };

  isChecked = (id: number): boolean =>
    this.state.selectedTimeseries.findIndex(
      timeseries => timeseries.id === id
    ) !== -1;

  onItemClose = (item: Item) => {
    const { selectedTimeseries } = this.state;
    const closedTimeseries = selectedTimeseries.find(
      timeseries => timeseries.id === item.id
    );

    if (closedTimeseries === undefined) {
      throw Error('Closing nonexisting timeseries should not be possible');
    }
    const newTimeseries = selectedTimeseries.filter(
      existing => existing.id !== item.id
    );
    this.setState({ selectedTimeseries: newTimeseries });

    if (this.props.onTimeserieSelectionChange) {
      this.props.onTimeserieSelectionChange(
        newTimeseries.map(x => x.id),
        closedTimeseries
      );
    }
  };

  onKeyDown = (e: KeyboardEvent) => {
    const { cursor, searchResults } = this.state;
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
    }

    if (!searchResults || searchResults.length === 0) {
      return;
    }

    // Arrow up
    if (e.keyCode === 38) {
      if (cursor === undefined || cursor === 0) {
        this.setState({ cursor: searchResults.length - 1 });
      } else {
        this.setState({ cursor: cursor - 1 });
      }
      return;
    }

    // Arrow down
    if (e.keyCode === 40) {
      if (cursor === undefined || cursor === searchResults.length - 1) {
        this.setState({ cursor: 0 });
      } else {
        this.setState({ cursor: cursor + 1 });
      }
      return;
    }

    // Enter
    if (e.keyCode === 13 && cursor !== undefined) {
      const item = searchResults[cursor];
      this.onTimeSerieClicked(item);
    }
  };

  onSelectAll = () => {
    const { allowStrings, onTimeserieSelectionChange } = this.props;
    const { searchResults, selectedTimeseries } = this.state;
    const newTimeseries = searchResults.filter(
      (result: sdk.Timeseries) =>
        !result.isString || (allowStrings && result.isString)
    );
    this.setState({
      selectedTimeseries: [
        ...new Set([...selectedTimeseries, ...newTimeseries]),
      ],
    });
    onTimeserieSelectionChange(newTimeseries.map(x => x.id), null);
  };

  onSelectNone = () => {
    const { onTimeserieSelectionChange } = this.props;
    this.setState({ selectedTimeseries: [] });
    onTimeserieSelectionChange([], null);
  };

  isAllSelected = () => {
    const { searchResults } = this.state;
    const { allowStrings } = this.props;

    return searchResults.every(series => {
      const isAllowed = allowStrings || !series.isString;
      return !isAllowed || this.isChecked(series.id);
    });
  };

  render() {
    const {
      allowStrings,
      single,
      hideSelected,
      rootAssetSelect,
      styles,
      strings,
    } = this.props;
    const {
      assetId,
      fetching,
      searchResults,
      selectedTimeseries,
      cursor,
    } = this.state;
    const lang = { ...defaultStrings, ...strings };

    return (
      <Wrapper>
        {!hideSelected && (
          <SelectedItems
            selectedItems={selectedTimeseries.map(t => ({
              id: t.id,
              name: t.name,
            }))}
            onItemClose={this.onItemClose}
          />
        )}
        <Search
          rootAssetSelect={rootAssetSelect}
          onAssetSelected={this.onSelectAsset}
          assetId={assetId || 0}
          onSearch={this.fetchTimeseries}
          strings={{
            searchPlaceholder: lang.searchPlaceholder,
            rootAssetSelectAll: lang.rootAssetSelectAll,
            rootAssetSelectLoading: lang.rootAssetSelectLoading,
          }}
          onKeyDown={this.onKeyDown}
        />
        {searchResults.length > 0 && !single ? (
          <ButtonRow style={styles && styles.buttonRow}>
            <SelectAllButton
              htmlType="button"
              onClick={this.onSelectAll}
              disabled={this.isAllSelected()}
              style={styles && styles.selectAllButton}
            >
              {lang.selectAll}
            </SelectAllButton>
            <SelectNoneButton
              htmlType="button"
              onClick={this.onSelectNone}
              disabled={selectedTimeseries.length === 0}
              style={styles && styles.selectNoneButton}
            >
              {lang.selectNone}
            </SelectNoneButton>
          </ButtonRow>
        ) : null}
        <TagList style={styles && styles.list}>
          {fetching ? <CenteredSpin /> : null}
          {searchResults.map((timeseries: sdk.Timeseries, index: number) => (
            <DetailCheckbox
              className={`tag-search-result result-${timeseries.id} ${
                index === cursor ? 'active' : ''
              }`}
              key={`detail-checkbox--${timeseries.id}`}
              title={timeseries.name || timeseries.id.toString()}
              description={
                timeseries.description || timeseries.name || 'No description'
              }
              checkable={!single}
              checked={this.isChecked(timeseries.id)}
              onContainerClick={() => this.onTimeSerieClicked(timeseries)}
              disabled={!allowStrings && !!timeseries.isString}
            />
          ))}
        </TagList>
      </Wrapper>
    );
  }
}
