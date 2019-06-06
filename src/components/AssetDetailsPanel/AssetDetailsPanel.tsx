import { withAsset, WithAssetProps } from '../../hoc/withAsset';
import {
  AssetDetailsPanelPure,
  AssetDetailsPanelStylesProps,
} from './AssetDetailsPanelPure';

export type AssetDetailsPanelProps = WithAssetProps &
  AssetDetailsPanelStylesProps;

export const AssetDetailsPanel = withAsset(AssetDetailsPanelPure);
