// Copyright 2020 Cognite AS
import { CogniteClient, Timeseries } from '@cognite/sdk';
import React from 'react';
import { LoadingBlock } from '../components/common/LoadingBlock/LoadingBlock';
import {
  ERROR_API_UNEXPECTED_RESULTS,
  ERROR_NO_SDK_CLIENT,
} from '../constants/errorMessages';
import { SDK_LIST_LIMIT } from '../constants/sdk';
import { ClientSDKProxyContext } from '../context/clientSDKProxyContext';
import {
  CanceledPromiseException,
  ComponentWithUnmountState,
  connectPromiseToUnmountState,
} from '../utils/promise';
import {
  WithAssetTimeseriesDataProps,
  WithAssetTimeseriesProps,
  WithAssetTimeseriesState,
} from './interfaces/WithAssetTimeseriesInterfaces';

export const withAssetTimeseries = <P extends WithAssetTimeseriesDataProps>(
  WrapperComponent: React.ComponentType<P>
) =>
  // eslint-disable-next-line react/display-name
  class
    extends React.Component<
      Omit<P, keyof WithAssetTimeseriesDataProps> & WithAssetTimeseriesProps,
      WithAssetTimeseriesState
    >
    implements ComponentWithUnmountState {
    static contextType = ClientSDKProxyContext;

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
    context!: React.ContextType<typeof ClientSDKProxyContext>;
    client!: CogniteClient;
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
      this.client = this.context(WrapperComponent.displayName || '')!;
      if (!this.client) {
        console.error(ERROR_NO_SDK_CLIENT);
        return;
      }
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
      if (!this.client.timeseries) {
        console.error(ERROR_API_UNEXPECTED_RESULTS);
        return;
      }
      try {
        const { assetId, queryParams } = this.props;
        const assetTimeseries = ((await connectPromiseToUnmountState(
          this,
          this.client.timeseries
            .list({
              limit: SDK_LIST_LIMIT,
              ...queryParams,
              filter: {
                ...(queryParams && queryParams.filter),
                assetIds: [assetId],
              },
            })
            .autoPagingToArray()
        )) as any) as Timeseries[];
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
