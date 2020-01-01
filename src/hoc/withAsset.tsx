import { Asset } from '@cognite/sdk';
import React, { ComponentType } from 'react';
import { Subtract } from 'utility-types';
import { LoadingBlock } from '../components/common/LoadingBlock/LoadingBlock';
import {
  ERROR_API_UNEXPECTED_RESULTS,
  ERROR_NO_SDK_CLIENT,
} from '../constants/errorMessages';
import { ClientSDKContext } from '../context/clientSDKContext';
import { WithAssetDataProps, WithAssetProps } from '../interfaces/AssetTypes';
import {
  CanceledPromiseException,
  ComponentWithUnmountState,
  connectPromiseToUnmountState,
} from '../utils/promise';

export interface WithAssetState {
  isLoading: boolean;
  asset: Asset | null;
  assetId: number;
}

export const withAsset = <P extends WithAssetDataProps>(
  WrapperComponent: ComponentType<P>
) =>
  class
    extends React.Component<
      Subtract<P, WithAssetDataProps> & WithAssetProps,
      WithAssetState
    >
    implements ComponentWithUnmountState {
    static contextType = ClientSDKContext;

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
    context!: React.ContextType<typeof ClientSDKContext>;

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
      if (!this.context) {
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
          this.context!.assets.retrieve([{ id: this.props.assetId }])
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
