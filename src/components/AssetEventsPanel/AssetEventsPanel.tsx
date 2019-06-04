import { withAssetEvents } from '../../hoc/withAssetEvents';
import {
  AssetEventsPanelProps,
  AssetEventsPanelPure,
} from './components/AssetEventsPanelPure';

export type AssetEventsPanelProps = AssetEventsPanelProps;

export const AssetEventsPanel = withAssetEvents(AssetEventsPanelPure);
