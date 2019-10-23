import React from 'react';
import { WithAssetDataProps } from '../../hoc/withAsset';
import { DescriptionList } from '../DescriptionList';
import { MetaDescriptionListProps } from '../DescriptionList';

export interface AssetDetailsPanelStylesProps {
  styles?: React.CSSProperties;
}

export type AssetDetailsPanelPureProps = WithAssetDataProps &
  MetaDescriptionListProps &
  AssetDetailsPanelStylesProps;

export const AssetDetailsPanelPure: React.SFC<AssetDetailsPanelPureProps> = ({
  asset,
  children,
  ...restProps
}) => <DescriptionList valueSet={asset.metadata || {}} {...restProps} />;
