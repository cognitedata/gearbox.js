import { withAsset, WithAssetProps } from '../../hoc/withAsset';
import { MetaDescriptionListProps } from '../DescriptionList';
import {
  AssetDetailsPanelPure,
  AssetDetailsPanelStylesProps,
} from './AssetDetailsPanelPure';

export type AssetDetailsPanelProps = WithAssetProps &
  MetaDescriptionListProps &
  AssetDetailsPanelStylesProps;

export const AssetDetailsPanel = withAsset(AssetDetailsPanelPure);
