import * as sdk from '@cognite/sdk';
import { Spin } from 'antd';
import { debounce } from 'lodash';
import React, { KeyboardEvent } from 'react';
import styled from 'styled-components';
import { ApiQuery } from '../../interfaces';
import { DetailCheckbox } from '../common/DetailCheckbox/DetailCheckbox';
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

export interface TimeseriesSearchStyles {
  list?: React.CSSProperties;
}

export interface TimeseriesSearchProps {
  selectedTimeseries: number[];
  single: boolean;

  hideSelected: boolean;
  allowStrings: boolean;
  onTimeserieSelectionChange: (
    newTimeseriesIds: number[],
    selectedTimeseries: sdk.Timeseries
  ) => void;
  rootAsset?: number;
  filterRule?: (timeseries: sdk.Timeseries) => boolean;
  onError?: (error: Error) => void;
  styles?: TimeseriesSearchStyles;
}

interface TimeseriesSearchState {
  assetId?: number;
  assets: sdk.Asset[];
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
    filterRule: undefined,
    hideSelected: false,
    allowStrings: false,
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
      assets: [],
    };
    this.fetchTimeseries = debounce(this.fetchTimeseries, 200, {
      leading: false,
      trailing: true,
    });
  }

  async componentDidMount() {
    const apiAssets = await sdk.Assets.list({ depth: 0 });
    const assets = apiAssets.items.map(
      (apiAsset: sdk.Asset): sdk.Asset => {
        return {
          id: apiAsset.id,
          name: apiAsset.name || '',
          description: apiAsset.description,
          path: apiAsset.path,
          depth: apiAsset.depth,
          metadata: apiAsset.metadata,
          parentId: apiAsset.parentId,
          createdTime: apiAsset.createdTime,
          lastUpdatedTime: apiAsset.lastUpdatedTime,
        };
      }
    );
    this.setState({ assets });
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
    const { allowStrings } = this.props;
    if (!allowStrings && timeseries.isString) {
      return;
    }

    let newTimeseries: sdk.Timeseries[] = [];
    if (this.props.single) {
      newTimeseries = [timeseries];
    } else if (!this.isChecked(timeseries.id)) {
      newTimeseries = [...this.state.selectedTimeseries, timeseries];
    } else {
      newTimeseries = [...this.state.selectedTimeseries].filter(
        existing => existing.id !== timeseries.id
      );
    }
    this.setState({ selectedTimeseries: newTimeseries });

    this.props.onTimeserieSelectionChange(
      newTimeseries.map(x => x.id),
      timeseries
    );
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

  render() {
    const { allowStrings, single, hideSelected, styles } = this.props;
    const {
      assetId,
      fetching,
      searchResults,
      assets,
      selectedTimeseries,
      cursor,
    } = this.state;

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
          rootAssetSelect={true}
          onAssetSelected={this.onSelectAsset}
          assets={assets}
          assetId={assetId || 0}
          onSearch={this.fetchTimeseries}
          strings={{ searchPlaceholder: 'Search for timeseries' }}
          onKeyDown={this.onKeyDown}
        />
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
