import { CogniteClient } from '@cognite/sdk';
import React from 'react';
import { LoadingBlock } from '../components/common/LoadingBlock/LoadingBlock';
import {
  ERROR_API_UNEXPECTED_RESULTS,
  ERROR_NO_SDK_CLIENT,
} from '../constants/errorMessages';
import { ClientSDKProxyContext } from '../context/clientSDKProxyContext';
import {
  CanceledPromiseException,
  ComponentWithUnmountState,
  connectPromiseToUnmountState,
} from '../utils/promise';
import {
  WithAssetDataProps,
  WithAssetProps,
  WithAssetState,
} from './interfaces';

export const withAsset = <P extends WithAssetDataProps>(
  WrapperComponent: React.ComponentType<P>
) =>
  // eslint-disable-next-line react/display-name
  class
    extends React.Component<
      Omit<P, keyof WithAssetDataProps> & WithAssetProps,
      WithAssetState
    >
    implements ComponentWithUnmountState {
    static contextType = ClientSDKProxyContext;

    static getDerivedStateFromProps(
      props: P & WithAssetProps,
      state: WithAssetState
    ) {
      if (props.assetId !== state.assetId) {
        return {
          isLoading: true,
          asset: null,
          assetId: props.assetId,
        };
      }

      return null;
    }
    context!: React.ContextType<typeof ClientSDKProxyContext>;
    client!: CogniteClient;

    isComponentUnmounted = false;

    constructor(props: P & WithAssetProps) {
      super(props);

      this.state = {
        isLoading: true,
        asset: null,
        assetId: props.assetId,
      };
    }

    componentDidMount() {
      this.client = this.context(WrapperComponent.displayName || '')!;
      if (!this.client) {
        console.error(ERROR_NO_SDK_CLIENT);
        return;
      }
      this.loadAsset();
    }

    componentWillUnmount() {
      this.isComponentUnmounted = true;
    }

    componentDidUpdate(prevProps: P & WithAssetProps) {
      if (prevProps.assetId !== this.props.assetId) {
        this.loadAsset();
      }
    }

    async loadAsset() {
      try {
        const assets = await connectPromiseToUnmountState(
          this,
          this.client.assets.retrieve([{ id: this.props.assetId }])
        );

        if (!assets || assets.length !== 1) {
          console.error(ERROR_API_UNEXPECTED_RESULTS);
          return;
        }

        this.setState({
          isLoading: false,
          asset: assets[0],
        });

        if (this.props.onAssetLoaded) {
          this.props.onAssetLoaded(assets[0]);
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
        onAssetLoaded,
        ...restProps
      } = this.props;
      const { isLoading, asset } = this.state;

      if (isLoading) {
        return customSpinner || <LoadingBlock />;
      }

      if (asset) {
        return (
          <WrapperComponent {...((restProps as any) as P)} asset={asset} />
        );
      }

      return null;
    }
  };
