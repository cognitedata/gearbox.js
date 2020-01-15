import { WithTimeseriesProps } from '../../hoc';
import { timeScales } from './TimeseriesChartMetaPure';

export type TimeseriesChartMetaPeriod = keyof typeof timeScales;

export interface TimeseriesChartMetaBase {
  /**
   * Defines whether to get live updates in chart and data point
   */
  liveUpdate?: boolean;
  /**
   * Interval in milliseconds for live updates
   */
  updateIntervalMillis?: number;
  /**
   *  One of six predefined time periods: `'lastYear'`, `'lastMonth'`, `'lastWeek'`, `'lastDay'`, `'lastHour'`, `'last15Minutes'`
   */
  defaultTimePeriod?: TimeseriesChartMetaPeriod;
  /**
   * Custom time period for TimeseriesChart. This prop overrides defaultTimePeriod. Time values should be in timestamp format.
   */
  defaultBasePeriod?: {
    startTime: number;
    endTime: number;
  };
  /**
   * Defines whether to show description of the timeseries
   */
  showDescription?: boolean;
  /**
   * Defines whether to show time periods radio buttons
   */
  showPeriods?: boolean;
  /**
   * Defines whether to show timeseries chart
   */
  showChart?: boolean;
  /**
   * Defines whether to show current data point (sensor value)
   */
  showDatapoint?: boolean;
  /**
   * Defines whether to show meta data of the timeseries
   */
  showMetadata?: boolean;
}

export interface TimeseriesChartMetaProps
  extends WithTimeseriesProps,
    TimeseriesChartMetaBase {}
