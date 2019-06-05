import { withAssetEvents } from '../../hoc/withAssetEvents';
import {
  AssetEventsPanelProps,
  AssetEventsPanelPure,
  MetaEventsProps,
} from './components/AssetEventsPanelPure';

export type AssetEventsPanelProps = AssetEventsPanelProps;
export type MetaEventsProps = MetaEventsProps;

export const AssetEventsPanel = withAssetEvents(AssetEventsPanelPure);
