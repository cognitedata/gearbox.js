// Copyright 2020 Cognite AS
import { Asset } from '@cognite/sdk';
import { ReactNode } from 'react';

export interface WithAssetProps {
  /**
   * Asset ID
   */
  assetId: number;
  /**
   * A custom spinner to be shown in tabs while data is being loaded
   */
  customSpinner?: ReactNode;
  /**
   * Function to be called after an asset has been fetched
   */
  onAssetLoaded?: (asset: Asset) => void;
}

export interface WithAssetDataProps {
  asset: Asset;
}

export interface WithAssetState {
  isLoading: boolean;
  asset: Asset | null;
  assetId: number;
}
