import { withAssetEvents } from '../../hoc/withAssetEvents';
import { AssetEventsPanelPure } from './components/AssetEventsPanelPure';

export const AssetEventsPanel = withAssetEvents(AssetEventsPanelPure);
