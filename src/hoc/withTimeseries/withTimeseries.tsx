import { Timeseries } from '@cognite/sdk';
import * as sdk from '@cognite/sdk';
import React from 'react';
import {LoadingOverlay} from '../../components/common/LoadingOverlay/LoadingOverlay';

export interface WithTimeseriesDataProps {
  timeseries: Timeseries;
  timeseriesId: number;
}

export interface WithTimeseriesProps {
  timeseriesId: number;
}

interface WithTimeseriesState {
  isLoading: boolean;
  timeseries: Timeseries | null;
  timeseriesId: number;
}

export function withTimeseries(
  WrapperComponent: React.ComponentType<WithTimeseriesDataProps>
) {
  return class WithTimeseriesData extends React.Component<
    WithTimeseriesProps,
    WithTimeseriesState
  > {
    constructor(props: WithTimeseriesProps) {
      super(props);

      this.state = {
        isLoading: true,
        timeseries: null,
        timeseriesId: props.timeseriesId,
      };
    }

    static getDerivedStateFromProps(props: WithTimeseriesProps, state: WithTimeseriesState) {
      if (props.timeseriesId !== state.timeseriesId) {
        return {
          isLoading: true,
          timeseries: null,
          timeseriesId: props.timeseriesId,
        };
      }

      return null;
    }

    async componentDidMount() {
      this.loadTimeseries();
    }

    async componentDidUpdate(prevProps: WithTimeseriesProps) {
      if (prevProps.timeseriesId !== this.props.timeseriesId) {
        this.loadTimeseries();
      }
    }

    async loadTimeseries() {
      const timeseries = await sdk.TimeSeries.retrieve(
        this.props.timeseriesId,
        true
      );

      this.setState({
        isLoading: false,
        timeseries,
      });
    }

    render() {
      const { isLoading, timeseries } = this.state;

      if (isLoading) {
        return  <LoadingOverlay isLoading={true} />;
      }

      if (timeseries) {
        return <WrapperComponent {...this.props} timeseries={timeseries} />;
      }

      return 'null';
    }
  };
}
