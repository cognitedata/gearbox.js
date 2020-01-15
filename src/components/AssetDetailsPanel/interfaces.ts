import { CSSProperties } from 'react';
import { WithAssetDataProps, WithAssetProps } from '../../hoc';
import { MetaDescriptionListProps } from '../DescriptionList';

export interface AssetDetailsPanelStylesProps {
  /**
   * Object that defines inline CSS style for container of the table
   */
  styles?: CSSProperties;
}

export type AssetDetailsPanelPureProps = WithAssetDataProps &
  MetaDescriptionListProps &
  AssetDetailsPanelStylesProps;

export type AssetDetailsPanelProps = WithAssetProps &
  MetaDescriptionListProps &
  AssetDetailsPanelStylesProps;
