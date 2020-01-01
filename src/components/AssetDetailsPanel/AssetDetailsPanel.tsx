import { withAsset } from '../../hoc/withAsset';
import {
  AssetDetailsPanelStylesProps,
  WithAssetProps,
} from '../../interfaces/AssetTypes';
import { MetaDescriptionListProps } from '../../interfaces/DescriptionListTypes';
import { AssetDetailsPanelPure } from './AssetDetailsPanelPure';

export type AssetDetailsPanelProps = WithAssetProps &
  MetaDescriptionListProps &
  AssetDetailsPanelStylesProps;

export const AssetDetailsPanel = withAsset(AssetDetailsPanelPure);
