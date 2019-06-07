import { Asset } from '@cognite/sdk';
import * as sdk from '@cognite/sdk';
import React from 'react';
import { Subtract } from 'utility-types';
import { LoadingBlock } from '../components/common/LoadingBlock/LoadingBlock';
import {
  CanceledPromiseException,
  ComponentWithUnmountState,
  connectPromiseToUnmountState,
} from '../utils/promise';

export interface WithAssetDataProps {
  asset: Asset;
}

export interface WithAssetProps {
  assetId: number;
  customSpinner?: React.ReactNode;
  onAssetLoaded?: (asset: Asset) => void;
}

export interface WithAssetState {
  isLoading: boolean;
  asset: Asset | null;
  assetId: number;
}

export const withAsset = <P extends WithAssetDataProps>(
  WrapperComponent: React.ComponentType<P>
) =>
  class
    extends React.Component<
      Subtract<P, WithAssetDataProps> & WithAssetProps,
      WithAssetState
    >
    implements ComponentWithUnmountState {
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
        const asset = await connectPromiseToUnmountState(
          this,
          sdk.Assets.retrieve(this.props.assetId)
        );

        this.setState({
          isLoading: false,
          asset,
        });

        if (this.props.onAssetLoaded) {
          this.props.onAssetLoaded(asset);
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
        return <WrapperComponent {...(restProps as any) as P} asset={asset} />;
      }

      return null;
    }
  };
