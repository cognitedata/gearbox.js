import { Timeseries } from '@cognite/sdk';
import * as sdk from '@cognite/sdk';
import React from 'react';
import styled from 'styled-components';
import { Subtract } from 'utility-types';
import { LoadingOverlay } from '../../components/common/LoadingOverlay/LoadingOverlay';

export interface WithTimeseriesDataProps {
  timeseries: Timeseries;
}

export interface WithTimeseriesProps {
  timeseriesId: number;
}

interface WithTimeseriesState {
  isLoading: boolean;
  timeseries: Timeseries | null;
  timeseriesId: number;
}

export function withTimeseries<P extends WithTimeseriesDataProps>(
  WrapperComponent: React.ComponentType<P>
) {
  return class WithTimeseriesData extends React.Component<
    Subtract<P, WithTimeseriesDataProps> & WithTimeseriesProps,
    WithTimeseriesState
  > {
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
    constructor(props: P & WithTimeseriesProps) {
      super(props);

      this.state = {
        isLoading: true,
        timeseries: null,
        timeseriesId: props.timeseriesId,
      };
    }

    async componentDidMount() {
      this.loadTimeseries();
    }

    async componentDidUpdate(prevProps: P & WithTimeseriesProps) {
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
        return (
          <SpinnerContainer>
            <LoadingOverlay isLoading={true} backgroundColor={'none'} />
          </SpinnerContainer>
        );
      }

      if (timeseries) {
        return (
          <WrapperComponent
            {...(this.props as any) as P}
            timeseries={timeseries}
          />
        );
      }

      return null;
    }
  };
}

const SpinnerContainer = styled.div`
  position: relative;
  height: 300px;
`;
