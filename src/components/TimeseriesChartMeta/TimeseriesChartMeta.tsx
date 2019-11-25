import { withTimeseries } from '../../hoc/withTimeseries';
import {
  TimeseriesChartMetaPeriod as Period,
  TimeseriesChartMetaProps as Props,
  TimeseriesChartMetaPure,
} from './TimeseriesChartMetaPure';

export type TimeseriesChartMetaProps = Props;
export type TimeseriesChartMetaPeriod = Period;

export const TimeseriesChartMeta = withTimeseries<TimeseriesChartMetaProps>(
  TimeseriesChartMetaPure
);
