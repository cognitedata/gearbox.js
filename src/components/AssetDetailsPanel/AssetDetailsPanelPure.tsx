import React from 'react';
import { WithAssetDataProps } from '../../hoc/withAsset';
import { DescriptionList } from '../DescriptionList';

export interface AssetDetailsPanelStylesProps {
  styles?: React.CSSProperties;
}

export type AssetDetailsPanelPureProps = WithAssetDataProps &
  AssetDetailsPanelStylesProps;

export const AssetDetailsPanelPure: React.SFC<AssetDetailsPanelPureProps> = ({
  asset,
  styles,
}) => <DescriptionList valueSet={asset.metadata || {}} styles={styles} />;
