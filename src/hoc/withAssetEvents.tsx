import { CogniteClient, CogniteEvent, EventFilterRequest } from '@cognite/sdk';
import React from 'react';
import { Subtract } from 'utility-types';
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

export interface WithAssetEventsDataProps {
  assetEvents: CogniteEvent[];
}

export interface WithAssetEventsProps {
  assetId: number;
  queryParams?: EventFilterRequest;
  customSpinner?: React.ReactNode;
  onAssetEventsLoaded?: (assetEvents: CogniteEvent[]) => void;
}

export interface WithAssetEventsState {
  isLoading: boolean;
  assetEvents: CogniteEvent[] | null;
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
    static contextType = ClientSDKProxyContext;

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

    context!: React.ContextType<typeof ClientSDKProxyContext>;
    client!: CogniteClient;

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
      this.client = this.context(WrapperComponent.displayName || '')!;
      if (!this.client) {
        console.error(ERROR_NO_SDK_CLIENT);
        return;
      }
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
        const events = await connectPromiseToUnmountState(
          this,
          this.client.events
            .list({
              limit: SDK_LIST_LIMIT,
              ...queryParams,
              filter: {
                ...(queryParams && queryParams.filter
                  ? queryParams.filter
                  : {}),
                assetIds: [assetId],
              },
            })
            .autoPagingToArray()
        );

        if (!events || !Array.isArray(events)) {
          console.error(ERROR_API_UNEXPECTED_RESULTS);
          return;
        }

        this.setState({
          isLoading: false,
          assetEvents: events,
        });

        if (this.props.onAssetEventsLoaded) {
          this.props.onAssetEventsLoaded(events);
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
            {...((restProps as any) as P)}
            assetEvents={assetEvents}
          />
        );
      }

      return null;
    }
  };
