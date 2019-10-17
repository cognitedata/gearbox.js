import React from 'react';
import { WithAssetDataProps } from '../../hoc/withAsset';
import { DescriptionList } from '../DescriptionList';
import { MetaDescriptionListProps } from '../DescriptionList';

export type MetaAssetDetailsProps = MetaDescriptionListProps;

export interface AssetDetailsPanelStylesProps {
  styles?: React.CSSProperties;
}

export type AssetDetailsPanelPureProps = WithAssetDataProps &
  MetaAssetDetailsProps &
  AssetDetailsPanelStylesProps;

export const AssetDetailsPanelPure: React.SFC<AssetDetailsPanelPureProps> = ({
  asset,
  children,
  ...restProps
}) => <DescriptionList valueSet={asset.metadata || {}} {...restProps} />;
