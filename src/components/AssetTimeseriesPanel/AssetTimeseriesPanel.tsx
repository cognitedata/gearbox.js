import { withAssetTimeseries } from '../../hoc/withAssetTimeseries';
import {
  MetaTimeseriesProps,
  TimeseriesPanelProps,
  TimeseriesPanelPure,
} from './components/TimeseriesPanelPure';

export type AssetTimeseriesPanelProps = TimeseriesPanelProps;
export type MetaTimeseriesProps = MetaTimeseriesProps;

export const AssetTimeseriesPanel = withAssetTimeseries(TimeseriesPanelPure);
