import React from 'react';
import { WithAssetDataProps, WithAssetProps } from '../../hoc';
import { MetaDescriptionListProps } from '../DescriptionList';

export interface AssetDetailsPanelStylesProps {
  styles?: React.CSSProperties;
}

export type AssetDetailsPanelPureProps = WithAssetDataProps &
  MetaDescriptionListProps &
  AssetDetailsPanelStylesProps;

export type AssetDetailsPanelProps = WithAssetProps &
  MetaDescriptionListProps &
  AssetDetailsPanelStylesProps;
