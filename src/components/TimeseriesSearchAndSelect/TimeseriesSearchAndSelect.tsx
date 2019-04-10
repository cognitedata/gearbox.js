import { Spin } from 'antd';
import AssetSearch from 'components/AssetSearch/AssetSearch';
import DetailCheckbox from 'components/DetailCheckbox/DetailCheckbox';
import { debounce } from 'lodash';
import * as sdk from '@cognite/sdk';
import React from 'react';
import styled from 'styled-components';
import { VApiQuery, VAsset, VId } from 'utils/validators';

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
  selectedTimeseries: string[];
  single?: boolean;
  allowStrings?: boolean;
  onTimeserieSelectionChange?: (
    newTimeseries: string[],
    selectedTimeserie: sdk.Timeseries
  ) => void;
  rootAsset?: VId;
  filterRule?: (timeseries: sdk.Timeseries) => boolean;
  onError?: (error: Error) => void;
}

export interface TimeserieSearchAndSelectState {
  assetId?: VId;
  assets: VAsset[];
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
    filterRule: (_: sdk.Timeseries) => true,
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
      assets: [],
    };
    this.fetchTimeseries = debounce(this.fetchTimeseries, 200, {
      leading: false,
      trailing: true,
    });
  }

  async componentDidMount() {
    const assets = await sdk.Assets.list({ depth: 0 });
    this.setState({ assets: assets.items });
  }

  onSelectAsset = (assetId: VId): void => {
    console.log('102');
    this.setState({ assetId, searchResults: [] });
  };

  onTimeSerieClicked = (timeseries: sdk.Timeseries): void => {
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
    const assetSubtreeNumbers =
      assetSubtrees == null
        ? undefined
        : assetSubtrees.map(
            (ast: VId): number => Number.parseInt(ast.toString(), 10)
          );
    sdk.TimeSeries.search({
      assetSubtrees: assetSubtreeNumbers,
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

  isChecked = (name: string): boolean =>
    [
      ...this.props.selectedTimeseries,
      ...this.state.selectedTimeseries,
    ].findIndex(timeseries => timeseries === name) !== -1;

  render() {
    const { allowStrings, single } = this.props;
    const { assetId, fetching, searchResults, assets } = this.state;

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
          {searchResults.map((timeseries: sdk.Timeseries) => (
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
              disabled={!allowStrings && !!timeseries.isString}
            />
          ))}
        </TagList>
      </Wrapper>
    );
  }
}

export default TimeserieSearchAndSelect;
