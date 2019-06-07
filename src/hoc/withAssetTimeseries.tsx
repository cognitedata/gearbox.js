import { Timeseries, TimeseriesListParams } from '@cognite/sdk';
import * as sdk from '@cognite/sdk';
import React from 'react';
import { Subtract } from 'utility-types';
import { LoadingBlock } from '../components/common/LoadingBlock/LoadingBlock';
import { SDK_LIST_LIMIT } from '../constants/sdk';
import {
  CanceledPromiseException,
  ComponentWithUnmountState,
  connectPromiseToUnmountState,
} from '../utils/promise';

export interface WithAssetTimeseriesDataProps {
  assetTimeseries: Timeseries[];
}

export interface WithAssetTimeseriesProps {
  assetId: number;
  queryParams?: TimeseriesListParams;
  customSpinner?: React.ReactNode;
  onAssetTimeseriesLoaded?: (assetTimeseries: Timeseries[]) => void;
}

export interface WithAssetTimeseriesState {
  isLoading: boolean;
  assetTimeseries: Timeseries[] | null;
  assetId: number;
}

export const withAssetTimeseries = <P extends WithAssetTimeseriesDataProps>(
  WrapperComponent: React.ComponentType<P>
) =>
  class
    extends React.Component<
      Subtract<P, WithAssetTimeseriesDataProps> & WithAssetTimeseriesProps,
      WithAssetTimeseriesState
    >
    implements ComponentWithUnmountState {
    static getDerivedStateFromProps(
      props: P & WithAssetTimeseriesProps,
      state: WithAssetTimeseriesState
    ) {
      if (props.assetId !== state.assetId) {
        return {
          isLoading: true,
          assetTimeseries: null,
          assetId: props.assetId,
        };
      }

      return null;
    }

    isComponentUnmounted = false;

    constructor(props: P & WithAssetTimeseriesProps) {
      super(props);

      this.state = {
        isLoading: true,
        assetTimeseries: null,
        assetId: props.assetId,
      };
    }

    componentDidMount() {
      this.loadAssetTimeseries();
    }

    componentWillUnmount() {
      this.isComponentUnmounted = true;
    }

    componentDidUpdate(prevProps: P & WithAssetTimeseriesProps) {
      if (prevProps.assetId !== this.props.assetId) {
        this.loadAssetTimeseries();
      }
    }

    async loadAssetTimeseries() {
      try {
        const { assetId, queryParams } = this.props;
        const res = await connectPromiseToUnmountState(
          this,
          sdk.TimeSeries.list({
            limit: SDK_LIST_LIMIT,
            ...queryParams,
            assetId,
          })
        );

        this.setState({
          isLoading: false,
          assetTimeseries: res.items,
        });

        if (this.props.onAssetTimeseriesLoaded) {
          this.props.onAssetTimeseriesLoaded(res.items);
        }
      } catch (error) {
        if (error instanceof CanceledPromiseException !== true) {
          throw error;
        }
      }
    }

    render() {
      const {
        assetId,
        customSpinner,
        onAssetTimeseriesLoaded,
        ...restProps
      } = this.props;
      const { isLoading, assetTimeseries } = this.state;

      if (isLoading) {
        return customSpinner || <LoadingBlock />;
      }

      if (assetTimeseries) {
        return (
          <WrapperComponent
            {...(restProps as any) as P}
            assetTimeseries={assetTimeseries}
          />
        );
      }

      return null;
    }
  };
