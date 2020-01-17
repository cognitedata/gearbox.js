import { withAssetTimeseries } from '../../hoc';
import { TimeseriesPanelPure } from './components/TimeseriesPanelPure';

export const AssetTimeseriesPanel = withAssetTimeseries(TimeseriesPanelPure);
