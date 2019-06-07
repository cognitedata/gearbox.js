import {
  withAssetTimeseries,
  WithAssetTimeseriesProps,
} from '../../hoc/withAssetTimeseries';
import {
  AssetTimeseriesPanelStyles,
  MetaTimeseriesProps,
  TimeseriesPanelPure,
} from './components/TimeseriesPanelPure';

export type AssetTimeseriesPanelStyles = AssetTimeseriesPanelStyles;

export type AssetTimeseriesPanelProps = WithAssetTimeseriesProps &
  MetaTimeseriesProps;
export type MetaTimeseriesProps = MetaTimeseriesProps;

export const AssetTimeseriesPanel = withAssetTimeseries(TimeseriesPanelPure);
