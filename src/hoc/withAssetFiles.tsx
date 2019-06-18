import {
  FileRequestFilter,
  FilesMetadata,
} from '@cognite/sdk-alpha/dist/src/types/types';
import React from 'react';
import { Subtract } from 'utility-types';
import { LoadingBlock } from '../components/common/LoadingBlock/LoadingBlock';
import {
  ERROR_API_UNEXPECTED_RESULTS,
  ERROR_NO_SDK_CLIENT,
} from '../constants/errorMessages';
import { SDK_LIST_LIMIT } from '../constants/sdk';
import { ClientSDKContext } from '../context/clientSDKContext';
import {
  CanceledPromiseException,
  ComponentWithUnmountState,
  connectPromiseToUnmountState,
} from '../utils/promise';

export interface WithAssetFilesDataProps {
  assetFiles: FilesMetadata[];
}

export interface WithAssetFilesProps {
  assetId: number;
  queryParams?: FileRequestFilter;
  customSpinner?: React.ReactNode;
  onAssetFilesLoaded?: (assetFiles: FilesMetadata[]) => void;
}

export interface WithAssetFilesState {
  isLoading: boolean;
  assetFiles: FilesMetadata[] | null;
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
    static contextType = ClientSDKContext;
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

    context!: React.ContextType<typeof ClientSDKContext>;

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
      if (!this.context) {
        console.error(ERROR_NO_SDK_CLIENT);
        return;
      }
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
        const { assetId, queryParams } = this.props;
        const files = await connectPromiseToUnmountState(
          this,
          this.context!.files.list({
            limit: SDK_LIST_LIMIT,
            ...queryParams,
            filter: {
              ...(queryParams && queryParams.filter ? queryParams.filter : {}),
              assetIds: [assetId],
            },
          }).autoPagingToArray()
        );

        if (!files || !Array.isArray(files)) {
          console.error(ERROR_API_UNEXPECTED_RESULTS);
          return;
        }

        this.setState({
          isLoading: false,
          assetFiles: files,
        });

        if (this.props.onAssetFilesLoaded) {
          this.props.onAssetFilesLoaded(files);
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
            {...((restProps as any) as P)}
            assetFiles={assetFiles}
          />
        );
      }

      return null;
    }
  };
