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

export interface WithAssetFilesProps {
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
      Subtract<P, WithAssetFilesDataProps> & WithAssetFilesProps,
      WithAssetFilesState
    >
    implements ComponentWithUnmountState {
    static getDerivedStateFromProps(
      props: P & WithAssetFilesProps,
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

    constructor(props: P & WithAssetFilesProps) {
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

    componentDidUpdate(prevProps: P & WithAssetFilesProps) {
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
      const {
        assetId,
        customSpinner,
        onAssetFilesLoaded,
        ...restProps
      } = this.props;
      const { isLoading, assetFiles } = this.state;

      if (isLoading) {
        return customSpinner || <LoadingBlock />;
      }

      if (assetFiles) {
        return (
          <WrapperComponent
            {...(restProps as any) as P}
            assetFiles={assetFiles}
          />
        );
      }

      return null;
    }
  };
