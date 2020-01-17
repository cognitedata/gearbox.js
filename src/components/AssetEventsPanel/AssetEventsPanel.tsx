import { withAssetEvents } from '../../hoc';
import { AssetEventsPanelPure } from './components/AssetEventsPanelPure';

export const AssetEventsPanel = withAssetEvents(AssetEventsPanelPure);
