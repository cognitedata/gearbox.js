import React from 'react';
import { WithAssetDataProps } from '../../hoc/withAsset';
import { DescriptionList } from '../DescriptionList';

export interface AssetDetailsPanelPureProps extends WithAssetDataProps {
  styles?: React.CSSProperties;
}

export const AssetDetailsPanelPure: React.SFC<AssetDetailsPanelPureProps> = ({
  asset,
  styles,
}) => <DescriptionList valueSet={asset.metadata || {}} styles={styles} />;
