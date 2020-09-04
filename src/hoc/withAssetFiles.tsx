// Copyright 2020 Cognite AS
import { CogniteClient } from '@cognite/sdk';
import React from 'react';
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
import {
  WithAssetFilesDataProps,
  WithAssetFilesProps,
  WithAssetFilesState,
} from './interfaces';

export const withAssetFiles = <P extends WithAssetFilesDataProps>(
  WrapperComponent: React.ComponentType<P>
) =>
  // eslint-disable-next-line react/display-name
  class
    extends React.Component<
      Omit<P, keyof WithAssetFilesDataProps> & WithAssetFilesProps,
      WithAssetFilesState
    >
    implements ComponentWithUnmountState {
    static contextType = ClientSDKProxyContext;
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

    context!: React.ContextType<typeof ClientSDKProxyContext>;
    client!: CogniteClient;

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
      this.client = this.context(WrapperComponent.displayName || '')!;
      if (!this.client) {
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
          this.client.files
            .list({
              limit: SDK_LIST_LIMIT,
              ...queryParams,
              filter: {
                ...(queryParams && queryParams.filter),
                assetIds: [assetId],
              },
            })
            .autoPagingToArray()
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
