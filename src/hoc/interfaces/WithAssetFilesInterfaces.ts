// Copyright 2020 Cognite AS
import { FileRequestFilter, FileInfo } from '@cognite/sdk';
import { ReactNode } from 'react';

export interface WithAssetFilesDataProps {
  assetFiles: FileInfo[];
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
  onAssetFilesLoaded?: (assetFiles: FileInfo[]) => void;
}

export interface WithAssetFilesState {
  isLoading: boolean;
  assetFiles: FileInfo[] | null;
  assetId: number;
}
