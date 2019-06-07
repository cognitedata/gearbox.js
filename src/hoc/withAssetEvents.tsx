import { Event, EventListParams } from '@cognite/sdk';
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

export interface WithAssetEventsDataProps {
  assetEvents: Event[];
}

export interface WithAssetEventsProps {
  assetId: number;
  queryParams?: EventListParams;
  customSpinner?: React.ReactNode;
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
      Subtract<P, WithAssetEventsDataProps> & WithAssetEventsProps,
      WithAssetEventsState
    >
    implements ComponentWithUnmountState {
    static getDerivedStateFromProps(
      props: P & WithAssetEventsProps,
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

    constructor(props: P & WithAssetEventsProps) {
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

    componentDidUpdate(prevProps: P & WithAssetEventsProps) {
      if (prevProps.assetId !== this.props.assetId) {
        this.loadAssetEvents();
      }
    }

    async loadAssetEvents() {
      try {
        const { assetId, queryParams } = this.props;
        const res = await connectPromiseToUnmountState(
          this,
          sdk.Events.list({
            limit: SDK_LIST_LIMIT,
            ...queryParams,
            assetId,
          })
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
      const {
        assetId,
        customSpinner,
        onAssetEventsLoaded,
        ...restProps
      } = this.props;
      const { isLoading, assetEvents } = this.state;

      if (isLoading) {
        return customSpinner || <LoadingBlock />;
      }

      if (assetEvents) {
        return (
          <WrapperComponent
            {...(restProps as any) as P}
            assetEvents={assetEvents}
          />
        );
      }

      return null;
    }
  };
