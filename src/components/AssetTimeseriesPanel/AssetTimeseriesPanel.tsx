import {
  withAssetTimeseries,
  WithAssetTimeseriesProps,
} from '../../hoc/withAssetTimeseries';
import {
  MetaTimeseriesProps,
  TimeseriesPanelPure,
} from './components/TimeseriesPanelPure';

export type AssetTimeseriesPanelProps = WithAssetTimeseriesProps &
  MetaTimeseriesProps;
export type MetaTimeseriesProps = MetaTimeseriesProps;

export const AssetTimeseriesPanel = withAssetTimeseries(TimeseriesPanelPure);
