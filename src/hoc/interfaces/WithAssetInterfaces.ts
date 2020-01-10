import { Asset } from '@cognite/sdk';
import React from 'react';

export interface WithAssetProps {
  assetId: number;
  customSpinner?: React.ReactNode;
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
