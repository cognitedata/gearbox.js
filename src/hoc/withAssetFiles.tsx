import { File } from '@cognite/sdk';
import * as sdk from '@cognite/sdk';
import React from 'react';
import { Subtract } from 'utility-types';
import { LoadingBlock } from '../components/common/LoadingBlock/LoadingBlock';
import {
  CanceledPromiseException,
  ComponentWithUnmountState,
  connectPromiseToUnmountState,
} from '../utils/promise';

export interface WithAssetFilesDataProps {
  assetFiles: File[];
}

export interface WithAssetProps {
  assetId: number;
  customSpinner?: React.ReactNode;
  onAssetFilesLoaded?: (assetFiles: File[]) => void;
}

export interface WithAssetFilesState {
  isLoading: boolean;
  assetFiles: File[] | null;
  assetId: number;
}

export const withAssetFiles = <P extends WithAssetFilesDataProps>(
  WrapperComponent: React.ComponentType<P>
) =>
  class
    extends React.Component<
      Subtract<P, WithAssetFilesDataProps> & WithAssetProps,
      WithAssetFilesState
    >
    implements ComponentWithUnmountState {
    static getDerivedStateFromProps(
      props: P & WithAssetProps,
      state: WithAssetFilesState
    ) {
      if (props.assetId !== state.assetId) {
        return {
          isLoading: true,
          assetFiles: null,
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
        assetFiles: null,
        assetId: props.assetId,
      };
    }

    componentDidMount() {
      this.loadAssetFiles();
    }

    componentWillUnmount() {
      this.isComponentUnmounted = true;
    }

    componentDidUpdate(prevProps: P & WithAssetProps) {
      if (prevProps.assetId !== this.props.assetId) {
        this.loadAssetFiles();
      }
    }

    async loadAssetFiles() {
      try {
        const filesRes = await connectPromiseToUnmountState(
          this,
          sdk.Files.list({ assetId: this.props.assetId, limit: 1000 })
        );

        this.setState({
          isLoading: false,
          assetFiles: filesRes.items,
        });

        if (this.props.onAssetFilesLoaded) {
          this.props.onAssetFilesLoaded(filesRes.items);
        }
      } catch (error) {
        if (error instanceof CanceledPromiseException !== true) {
          throw error;
        }
      }
    }

    render() {
      const { isLoading, assetFiles } = this.state;

      if (isLoading) {
        return this.props.customSpinner || <LoadingBlock />;
      }

      if (assetFiles) {
        return (
          <WrapperComponent
            {...(this.props as any) as P}
            assetFiles={assetFiles}
          />
        );
      }

      return null;
    }
  };
