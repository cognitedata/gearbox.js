import { Event } from '@cognite/sdk';
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

export interface WithAssetEventsDataProps {
  assetEvents: Event[];
}

export interface WithAssetProps {
  assetId: number;
  onAssetEventsLoaded?: (assetEvents: Event[]) => void;
}

export interface WithAssetEventsState {
  isLoading: boolean;
  assetEvents: Event[] | null;
  assetId: number;
}

export const withAssetEvents = <P extends WithAssetEventsDataProps>(
  WrapperComponent: React.ComponentType<P>
) =>
  class
    extends React.Component<
      Subtract<P, WithAssetEventsDataProps> & WithAssetProps,
      WithAssetEventsState
    >
    implements ComponentWithUnmountState {
    static getDerivedStateFromProps(
      props: P & WithAssetProps,
      state: WithAssetEventsState
    ) {
      if (props.assetId !== state.assetId) {
        return {
          isLoading: true,
          assetEvents: null,
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
        assetEvents: null,
        assetId: props.assetId,
      };
    }

    componentDidMount() {
      this.loadAssetEvents();
    }

    componentWillUnmount() {
      this.isComponentUnmounted = true;
    }

    componentDidUpdate(prevProps: P & WithAssetProps) {
      if (prevProps.assetId !== this.props.assetId) {
        this.loadAssetEvents();
      }
    }

    async loadAssetEvents() {
      try {
        const res = await connectPromiseToUnmountState(
          this,
          sdk.Events.list({ assetId: this.props.assetId, limit: 1000 })
        );

        this.setState({
          isLoading: false,
          assetEvents: res.items,
        });

        if (this.props.onAssetEventsLoaded) {
          this.props.onAssetEventsLoaded(res.items);
        }
      } catch (error) {
        if (error instanceof CanceledPromiseException !== true) {
          throw error;
        }
      }
    }

    render() {
      const { isLoading, assetEvents } = this.state;

      if (isLoading) {
        return (
          <SpinnerContainer>
            <LoadingOverlay isLoading={true} backgroundColor={'none'} />
          </SpinnerContainer>
        );
      }

      if (assetEvents) {
        return (
          <WrapperComponent
            {...(this.props as any) as P}
            assetEvents={assetEvents}
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
