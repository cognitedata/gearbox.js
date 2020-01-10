import React, { FC } from 'react';
import { DescriptionList } from '../DescriptionList';
import { AssetDetailsPanelPureProps } from './interfaces';

export const AssetDetailsPanelPure: FC<AssetDetailsPanelPureProps> = ({
  asset,
  children,
  ...restProps
}) => <DescriptionList valueSet={asset.metadata || {}} {...restProps} />;
