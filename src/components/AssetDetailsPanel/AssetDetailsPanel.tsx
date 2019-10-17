import { withAsset, WithAssetProps } from '../../hoc/withAsset';
import {
  AssetDetailsPanelPure,
  AssetDetailsPanelStylesProps,
  MetaAssetDetailsProps,
} from './AssetDetailsPanelPure';

export { MetaAssetDetailsProps };

export type AssetDetailsPanelProps = WithAssetProps &
  MetaAssetDetailsProps &
  AssetDetailsPanelStylesProps;

export const AssetDetailsPanel = withAsset(AssetDetailsPanelPure);
