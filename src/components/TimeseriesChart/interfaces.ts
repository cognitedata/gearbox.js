import {
  Annotation,
  DataProviderSeries as ProviderSeries,
} from '@cognite/griff-react';
import React from 'react';

type DataProviderSeries = ProviderSeries;
interface TimeseriesChartPropsBase {
  /**
   * The time the timeseries should start from. Should be UNIX timestamp or Date
   */
  startTime: number | Date;
  /**
   * The time the timeseries should end. Should be UNIX timestamp or Date
   */
  endTime: number | Date;
  /**
   * Whether the context chart should be showed
   */
  contextChart: boolean;
  /**
   * Custom styles for the component
   */
  styles?: TimeseriesChartStyles;
  /**
   * The number of aggregated datapoints to show
   */
  pointsPerSeries: number;
  /**
   * Whether zooming on the chart is enabled
   */
  zoomable: boolean;
  /**
   * Whether live update of chart is enabled
   */
  liveUpdate: boolean;
  /**
   * Whether crosshair should be shown
   */
  crosshair: boolean;
  /**
   * The update interval when live update is enabled
   */
  updateIntervalMillis: number;
  /**
   * Map of timeseries ids and color
   */
  timeseriesColors: { [id: number]: string };
  /**
   * Object desribing if timeseries id should be hidden
   */
  hiddenSeries: { [id: number]: boolean };
  /**
   * Display the ruler and configure custom label formatters
   */
  ruler: ChartRulerConfig;
  /**
   * Height of x-axis container in pixels. 0 will hide it completely
   */
  xAxisHeight: number;
  /**
   * Display mode of the y-axis
   */
  yAxisDisplayMode: 'ALL' | 'COLLAPSED' | 'NONE';
  /**
   * Placement of the y-axis
   */
  yAxisPlacement: 'RIGHT' | 'LEFT' | 'BOTH';
  /**
   * Height of the chart
   */
  height?: number;
  /**
   * Width of the chart
   */
  width?: number;
  /**
   * Mouse move callback
   */
  onMouseMove?: (e: any) => void;
  /**
   * On blur event callback
   */
  onBlur?: (e: any) => void;
  /**
   * On mouseout event callback
   */
  onMouseOut?: (e: any) => void;
  /**
   * Callback for failed data request
   */
  onFetchDataError?: (e: Error) => void;
  /**
   * @ignore
   */
  annotations: Annotation[];
  /**
   * @ignore
   */
  collections: any;
}

export interface ChartRulerPoint {
  id: number | string;
  name: string;
  value: number | string;
  color: string;
  timestamp: number;
  x: number;
  y: number;
}

export interface ChartRulerConfig {
  visible?: boolean;
  timeLabel?: (point: ChartRulerPoint) => string;
  yLabel?: (point: ChartRulerPoint) => string;
}

export interface TimeseriesChartStyles {
  container?: React.CSSProperties;
}

export interface TimeseriesChartByTimeseriesId {
  /**
   * Array of timeseries ids
   */
  timeseriesIds: number[];
}

export interface TimeseriesChartBySeries {
  /**
   * Array of DataProviderSeries
   */
  series: DataProviderSeries[];
}

export type TimeseriesChartProps =
  | (TimeseriesChartByTimeseriesId & TimeseriesChartPropsBase)
  | (TimeseriesChartBySeries & TimeseriesChartPropsBase);
