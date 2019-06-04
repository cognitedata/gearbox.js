import React from 'react';
import { withAsset, WithAssetProps } from '../../hoc/withAsset';
import { AssetDetailsPanelPure } from './AssetDetailsPanelPure';

export interface AssetDetailsPanelProps extends WithAssetProps {
  styles?: React.CSSProperties;
}

export const AssetDetailsPanel = withAsset(AssetDetailsPanelPure);
