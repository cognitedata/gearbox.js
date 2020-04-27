import { withAsset } from '../../hoc';
import { AssetDetailsPanelPure } from './AssetDetailsPanelPure';
import { AssetDetailsPanelPureProps } from './interfaces';

export const AssetDetailsPanel = withAsset<AssetDetailsPanelPureProps>(AssetDetailsPanelPure);
