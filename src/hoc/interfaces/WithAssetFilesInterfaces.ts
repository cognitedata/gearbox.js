import { FileRequestFilter, FilesMetadata } from '@cognite/sdk';
import React from 'react';

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
