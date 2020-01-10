import { withTimeseries } from '../../hoc';
import { TimeseriesChartMetaProps } from './interfaces';
import { TimeseriesChartMetaPure } from './TimeseriesChartMetaPure';

export const TimeseriesChartMeta = withTimeseries<TimeseriesChartMetaProps>(
  TimeseriesChartMetaPure
);
