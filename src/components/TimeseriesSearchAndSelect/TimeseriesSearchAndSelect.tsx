import { Spin } from 'antd';
import AssetSearch from 'components/AssetSearch/AssetSearch';
import DetailCheckbox from 'components/DetailCheckbox/DetailCheckbox';
import { debounce } from 'lodash';
import React from 'react';
import styled from 'styled-components';
import {
  VApiQuery,
  VTimeseriesQuery,
  VAsset,
  VId,
  VTimeseries,
} from 'utils/validators';

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

export const CenteredSpin = styled(Spin)`
  &.ant-spin-spinning {
    min-height: 25px;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export interface TimeserieSearchAndSelectProps {
  assets: VAsset[];
  selectedTimeseries: string[];
  single?: boolean;
  onSearch: (
    timeserieQuery: VTimeseriesQuery
  ) => Promise<{ items: VTimeseries[] }>;
  allowStrings?: boolean;
  onTimeserieSelectionChange?: (
    newTimeseries: string[],
    selectedTimeserie: VTimeseries
  ) => void;
  rootAsset?: VId;
  filterRule?: (timeseries: VTimeseries) => boolean;
  onError?: (error: Error) => void;
}

export interface TimeserieSearchAndSelectState {
  assetId?: VId;
  fetching: boolean;
  searchResults: any;
  selectedTimeseries: string[];
  lastFetchId: number;
}

class TimeserieSearchAndSelect extends React.Component<
  TimeserieSearchAndSelectProps,
  TimeserieSearchAndSelectState
> {
  static defaultProps = {
    selectedTimeseries: [],
    filterRule: (_: VTimeseries) => true,
  };

  static getDerivedStateFromProps(
    props: TimeserieSearchAndSelectProps,
    state: TimeserieSearchAndSelectState
  ) {
    if (props.rootAsset !== null && props.rootAsset !== state.assetId) {
      return { assetId: props.rootAsset };
    }
    return null;
  }

  constructor(props: TimeserieSearchAndSelectProps) {
    super(props);
    this.state = {
      assetId: props.rootAsset || undefined,
      fetching: false,
      searchResults: [],
      selectedTimeseries: props.selectedTimeseries || [],
      lastFetchId: 0,
    };
    this.fetchTimeseries = debounce(this.fetchTimeseries, 200, {
      leading: false,
      trailing: true,
    });
  }

  onSelectAsset = (assetId: VId): void => {
    this.setState({ assetId, searchResults: [] });
  };

  onTimeSerieClicked = (timeseries: VTimeseries): void => {
    let newTimeseries: string[] = [];

    if (this.props.single) {
      newTimeseries = [timeseries.name];
    } else if (!this.isChecked(timeseries.name)) {
      newTimeseries = [...this.state.selectedTimeseries, timeseries.name];
    } else {
      newTimeseries = [...this.state.selectedTimeseries].filter(
        existing => existing !== timeseries.name
      );
    }
    this.setState({ selectedTimeseries: newTimeseries });

    if (this.props.onTimeserieSelectionChange) {
      this.props.onTimeserieSelectionChange(newTimeseries, timeseries);
    }
  };

  fetchTimeseries = (apiQuery: VApiQuery): void => {
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
    this.props
      .onSearch({
        assetSubtrees,
        query,
        limit: 100,
      })
      .then(
        (data: { [items: string]: VTimeseries[] }): void => {
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

  isChecked = (name: string): boolean =>
    [
      ...this.props.selectedTimeseries,
      ...this.state.selectedTimeseries,
    ].findIndex(timeseries => timeseries === name) !== -1;

  render() {
    const { allowStrings, assets, single } = this.props;
    const { assetId, fetching, searchResults } = this.state;

    return (
      <Wrapper>
        <AssetSearch
          rootAssetSelect={true}
          onAssetSelected={this.onSelectAsset}
          assets={assets}
          assetId={assetId || 0}
          onSearch={this.fetchTimeseries}
          strings={{ searchPlaceholder: 'Search for timeseries' }}
        />
        <TagList style={{ marginTop: '8px' }}>
          {fetching ? <CenteredSpin /> : null}
          {searchResults.map((timeseries: VTimeseries) => (
            <DetailCheckbox
              className={`tag-search-result result-${timeseries.id}`}
              key={`detail-checkbox--${timeseries.id}`}
              title={timeseries.name || timeseries.id.toString()}
              description={
                timeseries.description || timeseries.name || 'No description'
              }
              checkable={!single}
              checked={this.isChecked(timeseries.name)}
              onContainerClick={() => this.onTimeSerieClicked(timeseries)}
              disabled={!allowStrings && timeseries.isString}
            />
          ))}
        </TagList>
      </Wrapper>
    );
  }
}

export default TimeserieSearchAndSelect;
