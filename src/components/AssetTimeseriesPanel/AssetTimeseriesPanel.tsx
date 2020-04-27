import { withAssetTimeseries } from '../../hoc';
import {
  TimeseriesPanelProps,
  TimeseriesPanelPure,
} from './components/TimeseriesPanelPure';

export const AssetTimeseriesPanel = withAssetTimeseries<TimeseriesPanelProps>(
  TimeseriesPanelPure
);
