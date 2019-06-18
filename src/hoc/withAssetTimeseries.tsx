import {
  GetTimeSeriesMetadataDTO,
  TimeseriesFilter,
} from '@cognite/sdk-alpha/dist/src/types/types';
import React from 'react';
import { Subtract } from 'utility-types';
import { LoadingBlock } from '../components/common/LoadingBlock/LoadingBlock';
import { ERROR_NO_SDK_CLIENT } from '../constants/errorMessages';
import { SDK_LIST_LIMIT } from '../constants/sdk';
import { ClientSDKContext } from '../context/clientSDKContext';
import {
  CanceledPromiseException,
  ComponentWithUnmountState,
  connectPromiseToUnmountState,
} from '../utils/promise';

export interface WithAssetTimeseriesDataProps {
  assetTimeseries: GetTimeSeriesMetadataDTO[];
}

export interface WithAssetTimeseriesProps {
  assetId: number;
  queryParams?: TimeseriesFilter;
  customSpinner?: React.ReactNode;
  onAssetTimeseriesLoaded?: (
    assetTimeseries: GetTimeSeriesMetadataDTO[]
  ) => void;
}

export interface WithAssetTimeseriesState {
  isLoading: boolean;
  assetTimeseries: GetTimeSeriesMetadataDTO[] | null;
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
    static contextType = ClientSDKContext;

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
    context!: React.ContextType<typeof ClientSDKContext>;
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
      if (!this.context || !this.context.timeseries) {
        console.error(ERROR_NO_SDK_CLIENT);
        return;
      }
      try {
        const { assetId, queryParams } = this.props;
        const assetTimeseries = ((await connectPromiseToUnmountState(
          this,
          this.context.timeseries
            .list({
              limit: SDK_LIST_LIMIT,
              ...queryParams,
              assetIds: [assetId],
            })
            .autoPagingToArray()
        )) as any) as GetTimeSeriesMetadataDTO[];
        this.setState({
          isLoading: false,
          assetTimeseries,
        });

        if (this.props.onAssetTimeseriesLoaded) {
          this.props.onAssetTimeseriesLoaded(assetTimeseries);
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
            {...((restProps as any) as P)}
            assetTimeseries={assetTimeseries}
          />
        );
      }

      return null;
    }
  };
