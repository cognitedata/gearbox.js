import {
  withAssetEvents,
  WithAssetEventsProps,
} from '../../hoc/withAssetEvents';
import {
  AssetEventsPanelPure,
  AssetEventsPanelStylesProps,
  MetaEventsProps as Props,
} from './components/AssetEventsPanelPure';

export type AssetEventsPanelProps = WithAssetEventsProps &
  Props &
  AssetEventsPanelStylesProps;
export type MetaEventsProps = Props;

export const AssetEventsPanel = withAssetEvents(AssetEventsPanelPure);
