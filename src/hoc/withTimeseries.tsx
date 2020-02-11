import { CogniteClient } from '@cognite/sdk';
import React from 'react';
import { Subtract } from 'utility-types';
import { LoadingBlock } from '../components/common/LoadingBlock/LoadingBlock';
import { ERROR_NO_SDK_CLIENT } from '../constants/errorMessages';
import { ClientSDKProxyContext } from '../context/clientSDKProxyContext';
import {
  CanceledPromiseException,
  ComponentWithUnmountState,
  connectPromiseToUnmountState,
} from '../utils/promise';
import {
  WithTimeseriesDataProps,
  WithTimeseriesProps,
  WithTimeseriesState,
} from './interfaces';

export const withTimeseries = <P extends WithTimeseriesDataProps>(
  WrapperComponent: React.ComponentType<P>
) =>
  class
    extends React.Component<
      Subtract<P, WithTimeseriesDataProps> & WithTimeseriesProps,
      WithTimeseriesState
    >
    implements ComponentWithUnmountState {
    static contextType = ClientSDKProxyContext;
    static getDerivedStateFromProps(
      props: P & WithTimeseriesProps,
      state: WithTimeseriesState
    ) {
      if (props.timeseriesId !== state.timeseriesId) {
        return {
          isLoading: true,
          timeseries: null,
          timeseriesId: props.timeseriesId,
        };
      }

      return null;
    }
    isComponentUnmounted = false;
    context!: React.ContextType<typeof ClientSDKProxyContext>;
    client!: CogniteClient;
    constructor(props: P & WithTimeseriesProps) {
      super(props);

      this.state = {
        isLoading: true,
        timeseries: null,
        timeseriesId: props.timeseriesId,
      };
    }

    componentDidMount() {
      this.client = this.context(WrapperComponent.displayName || '')!;
      if (!this.client) {
        console.error(ERROR_NO_SDK_CLIENT);
        return;
      }
      this.loadTimeseries();
    }

    componentWillUnmount() {
      this.isComponentUnmounted = true;
    }

    componentDidUpdate(prevProps: P & WithTimeseriesProps) {
      if (prevProps.timeseriesId !== this.props.timeseriesId) {
        this.loadTimeseries();
      }
    }

    async loadTimeseries() {
      try {
        const timeseries = await connectPromiseToUnmountState(
          this,
          this.client.timeseries.retrieve([{ id: this.props.timeseriesId }])
        );
        this.setState({
          isLoading: false,
          timeseries: timeseries[0],
        });
      } catch (error) {
        if (error instanceof CanceledPromiseException !== true) {
          throw error;
        }
      }
    }

    render() {
      const { timeseriesId, customSpinner, ...restProps } = this.props;
      const { isLoading, timeseries } = this.state;

      if (isLoading) {
        return customSpinner || <LoadingBlock />;
      }

      if (timeseries) {
        return (
          <WrapperComponent
            {...((restProps as any) as P)}
            timeseries={timeseries}
          />
        );
      }

      return null;
    }
  };
