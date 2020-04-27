import { withAssetEvents } from '../../hoc';
import { AssetEventsPanelPure } from './components/AssetEventsPanelPure';
import { AssetEventsPanelPropsPure } from './interfaces';

export const AssetEventsPanel = withAssetEvents<AssetEventsPanelPropsPure>(
  AssetEventsPanelPure
);
