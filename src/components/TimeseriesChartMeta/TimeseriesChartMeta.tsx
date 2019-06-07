import { withTimeseries } from '../../hoc/withTimeseries';
import {
  TimeseriesChartMetaPeriod,
  TimeseriesChartMetaProps,
  TimeseriesChartMetaPure,
} from './TimeseriesChartMetaPure';

export type TimeseriesChartMetaProps = TimeseriesChartMetaProps;
export type TimeseriesChartMetaPeriod = TimeseriesChartMetaPeriod;

export const TimeseriesChartMeta = withTimeseries<TimeseriesChartMetaProps>(
  TimeseriesChartMetaPure
);
