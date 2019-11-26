import {
  withAssetTimeseries,
  WithAssetTimeseriesProps,
} from '../../hoc/withAssetTimeseries';
import {
  AssetTimeseriesPanelStyles as Styles,
  MetaTimeseriesProps as Props,
  TimeseriesPanelPure,
} from './components/TimeseriesPanelPure';

export type AssetTimeseriesPanelStyles = Styles;

export type AssetTimeseriesPanelProps = WithAssetTimeseriesProps &
  MetaTimeseriesProps;
export type MetaTimeseriesProps = Props;

export const AssetTimeseriesPanel = withAssetTimeseries(TimeseriesPanelPure);
