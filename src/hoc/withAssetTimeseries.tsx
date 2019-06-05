import { Timeseries } from '@cognite/sdk';
import * as sdk from '@cognite/sdk';
import React from 'react';
import styled from 'styled-components';
import { Subtract } from 'utility-types';
import { LoadingOverlay } from '../components/common/LoadingOverlay/LoadingOverlay';
import {
  CanceledPromiseException,
  ComponentWithUnmountState,
  connectPromiseToUnmountState,
} from '../utils/promise';

export interface WithAssetTimeseriesDataProps {
  assetTimeseries: Timeseries[];
}

export interface WithAssetProps {
  assetId: number;
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
      Subtract<P, WithAssetTimeseriesDataProps> & WithAssetProps,
      WithAssetTimeseriesState
    >
    implements ComponentWithUnmountState {
    static getDerivedStateFromProps(
      props: P & WithAssetProps,
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

    constructor(props: P & WithAssetProps) {
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

    componentDidUpdate(prevProps: P & WithAssetProps) {
      if (prevProps.assetId !== this.props.assetId) {
        this.loadAssetTimeseries();
      }
    }

    async loadAssetTimeseries() {
      try {
        const res = await connectPromiseToUnmountState(
          this,
          sdk.TimeSeries.list({ assetId: this.props.assetId, limit: 1000 })
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
      const { isLoading, assetTimeseries } = this.state;

      if (isLoading) {
        return (
          this.props.customSpinner || (
            <SpinnerContainer>
              <LoadingOverlay isLoading={true} backgroundColor={'none'} />
            </SpinnerContainer>
          )
        );
      }

      if (assetTimeseries) {
        return (
          <WrapperComponent
            {...(this.props as any) as P}
            assetTimeseries={assetTimeseries}
          />
        );
      }

      return null;
    }
  };

const SpinnerContainer = styled.div`
  position: relative;
  height: 300px;
`;
