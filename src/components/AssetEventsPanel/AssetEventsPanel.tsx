import {
  withAssetEvents,
  WithAssetEventsProps,
} from '../../hoc/withAssetEvents';
import {
  AssetEventsPanelProps,
  AssetEventsPanelPure,
  AssetEventsPanelStylesProps,
  MetaEventsProps,
} from './components/AssetEventsPanelPure';

export type AssetEventsPanelProps = WithAssetEventsProps &
  MetaEventsProps &
  AssetEventsPanelStylesProps;
export type MetaEventsProps = MetaEventsProps;

export const AssetEventsPanel = withAssetEvents(AssetEventsPanelPure);
