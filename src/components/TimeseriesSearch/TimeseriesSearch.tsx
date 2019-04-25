import * as sdk from '@cognite/sdk';
import { Spin } from 'antd';
import { debounce } from 'lodash';
import React from 'react';
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
  margin-top: 16px;
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

export interface TimeseriesSearchProps {
  selectedTimeseries: number[];
  single?: boolean;

  hideSelected: boolean;
  allowStrings?: boolean;
  onTimeserieSelectionChange?: (
    newTimeseries: number[],
    selectedTimeserie: sdk.Timeseries
  ) => void;
  rootAsset?: number;
  filterRule?: (timeseries: sdk.Timeseries) => boolean;
  onError?: (error: Error) => void;
}

interface TimeseriesSearchState {
  assetId?: number;
  assets: sdk.Asset[];
  fetching: boolean;
  searchResults: sdk.Timeseries[];
  selectedTimeseries: Item[];
  lastFetchId: number;
}

export class TimeseriesSearch extends React.Component<
  TimeseriesSearchProps,
  TimeseriesSearchState
> {
  static defaultProps = {
    selectedTimeseries: [],
    filterRule: () => true,
    hideSelected: false,
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
      const apiTimeseries = await sdk.TimeSeries.retrieveMultiple(
        selectedTimeseries
      );
      const timeseries = apiTimeseries.map(item => ({
        id: item.id,
        name: item.name,
      }));
      this.setState({ selectedTimeseries: timeseries });
    }
  }

  onSelectAsset = (assetId: number): void => {
    this.setState({ assetId, searchResults: [] });
  };

  onTimeSerieClicked = (timeseries: sdk.Timeseries): void => {
    let newTimeseries: Item[] = [];
    const item = { id: timeseries.id, name: timeseries.name };
    if (this.props.single) {
      newTimeseries = [item];
    } else if (!this.isChecked(timeseries.id)) {
      newTimeseries = [...this.state.selectedTimeseries, item];
    } else {
      newTimeseries = [...this.state.selectedTimeseries].filter(
        existing => existing.id !== item.id
      );
    }
    this.setState({ selectedTimeseries: newTimeseries });

    if (this.props.onTimeserieSelectionChange) {
      this.props.onTimeserieSelectionChange(
        newTimeseries.map(x => x.id),
        timeseries
      );
    }
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

  onItemClose = (items: Item[]) => {
    this.setState({ selectedTimeseries: items });
  };

  render() {
    const { allowStrings, single, hideSelected } = this.props;
    const { assetId, fetching, searchResults, assets } = this.state;

    return (
      <Wrapper>
        {!hideSelected && (
          <SelectedItems
            selectedItems={this.state.selectedTimeseries}
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
        />
        <TagList style={{ marginTop: '8px' }}>
          {fetching ? <CenteredSpin /> : null}
          {searchResults.map((timeseries: sdk.Timeseries) => (
            <DetailCheckbox
              className={`tag-search-result result-${timeseries.id}`}
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
