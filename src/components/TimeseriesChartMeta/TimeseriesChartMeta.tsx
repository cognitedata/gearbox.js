import { withTimeseries } from '../../hoc/withTimeseries/withTimeseries';
import {
  TimeseriesChartMetaProps,
  TimeseriesChartMetaPure,
} from './TimeseriesChartMetaPure';

export const TimeseriesChartMeta = withTimeseries<TimeseriesChartMetaProps>(
  TimeseriesChartMetaPure
);
