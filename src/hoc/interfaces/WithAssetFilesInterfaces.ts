import { FileRequestFilter, FilesMetadata } from '@cognite/sdk';
import { ReactNode } from 'react';

export interface WithAssetFilesDataProps {
  assetFiles: FilesMetadata[];
}

export interface WithAssetFilesProps {
  /**
   * Asset ID
   */
  assetId: number;
  /**
   * Additional parameters for SDK call. Please notice that assetId
   * provided in props will override property assetIds in queryParams.filter
   */
  queryParams?: FileRequestFilter;
  /**
   * A custom spinner to be shown in tabs while data is being loaded
   */
  customSpinner?: ReactNode;
  /**
   * Function to be called after files have been fetched
   */
  onAssetFilesLoaded?: (assetFiles: FilesMetadata[]) => void;
}

export interface WithAssetFilesState {
  isLoading: boolean;
  assetFiles: FilesMetadata[] | null;
  assetId: number;
}
