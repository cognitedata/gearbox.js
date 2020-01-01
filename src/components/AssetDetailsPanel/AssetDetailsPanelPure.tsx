import React, { FC } from 'react';
import {
  AssetDetailsPanelStylesProps,
  WithAssetDataProps,
} from '../../interfaces/AssetTypes';
import { MetaDescriptionListProps } from '../../interfaces/DescriptionListTypes';
import { DescriptionList } from '../DescriptionList';

export type AssetDetailsPanelPureProps = WithAssetDataProps &
  MetaDescriptionListProps &
  AssetDetailsPanelStylesProps;

export const AssetDetailsPanelPure: FC<AssetDetailsPanelPureProps> = ({
  asset,
  children,
  ...restProps
}) => <DescriptionList valueSet={asset.metadata || {}} {...restProps} />;
